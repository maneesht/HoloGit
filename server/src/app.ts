import { encode } from 'punycode';
import { isAbsolute } from 'path';
import { GitPoller } from './gitpoller';
import * as passport from 'passport';
import * as express from 'express';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as expressSession from 'express-session';
import * as request from 'request';
import {Strategy} from 'passport-github2';
const GITHUB_CLIENT_ID = 'f10bae450fbb2df2d082';
const GITHUB_CLIENT_SECRET = 'b63e9226988bf692208873846b396a6bddf70698';
import { GraphQLInt, GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString, graphql } from 'graphql';
import * as graphqlHTTP from 'express-graphql';
import { routes } from './routes';
export class Server {
    public app: express.Application;
    public port = process.env.PORT || 3000;
    constructor() {
        this.app = express();
        passport.use(new Strategy({
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: "http://holo-git.herokuapp.com/auth/github/callback"
            },
            (accessToken, refreshToken, profile, done) => { done(null, Object.assign({}, profile, {
                accessToken: accessToken
            }))}
        ));
        passport.serializeUser((user, cb) => cb(null, user));
        passport.deserializeUser((user, cb) => cb(null, user));
        this.app.use(morgan('combined'));
        this.app.use(cookieParser());
        this.app.use('/graphql', bodyParser.urlencoded( { extended: true }));
        this.app.use('/login', bodyParser.urlencoded( { extended: true }));
        this.app.use('/graphql', bodyParser.json());
        this.app.use(expressSession({secret: 'keyboard cat', resave: true, saveUninitialized: true}));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
    }
}
//TODO add the ability to have the repo field with the arguments repo and username
//TODO update calls to gitpoller to use the passed in username and repo name


let CommitQL = new GraphQLObjectType({
    name: 'Commit',
    fields: {
        sha: { type: GraphQLString },
        author: { type: GraphQLString },
        message: { type: GraphQLString },
        parentSha: { type: GraphQLString }
    },
});
let BranchQL = new GraphQLObjectType({
    name: "Branch",
    fields: {
        id: {
            type: GraphQLString,
            resolve: (_) => {
                return _.branchID;
            }
        },
        commits: {
            type: new GraphQLList(CommitQL),
            args: {
                sha: { type: GraphQLString }
            },
            resolve: (_, { sha }) => {
                if (!sha) {
                    return _.commits;
                }
                return _.commits.filter((commits: any) => commits.sha === sha);
            }
        }
    }
})
const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        branches: {
            type: new GraphQLList(BranchQL),
            args: {
                username: { type: GraphQLString },
                repo: { type: GraphQLString },
                branchName: { type: GraphQLString },
            },
            resolve: (_, { repo, username, branchName }, context) => {
                var auth = context.session.authorization;
                if (branchName) {
                    return GitPoller.getBranch(username, repo, branchName, auth);
                }
                return GitPoller.getRepo(username, repo, auth);
            }
        },
    }
})
const schema = new GraphQLSchema({
    query: queryType
});
let server: Server = new Server();
let app: express.Application = server.app;
function isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
    if(req.user || req.path !== '/graphql') {
        return next();
    }
    res.redirect('/login');
}
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));
app.use("/", routes);
app.get('/logout', function(req, res){
    req.session.authorization = null;
    req.logout();
    res.redirect('/');
});
app.get('/login', (req, res, next) => {
    res.send(`
        <html>
            <body>
                <form action="/login" method="post">
                    <input name="username">
                    <input name="password" type="password">
                    <input type="submit" value="Submit">
                </form>
            </body>
        </html>
    `)
})
app.post('/login', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    //let username = req.body.username;
    //let password = req.body.password;
    let encoded = new Buffer(`${username}:${password}`).toString('base64');
    let r = request.get({
        headers: {
            'content-type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Basic ' + encoded,
            'User-Agent': 'holo-git/1.0'
        },
        url: 'https://api.github.com/repos/maneesht/hologit/branches'
    }, (err, httpResponse, body) => {
        req.session.authorization = 'Basic ' + encoded;
        res.send(req.session);
    });
});
app.listen(server.port, () => console.log(`listening on port ${server.port}`));

export { CommitQL, BranchQL, queryType, graphql, GraphQLString, GraphQLList };
