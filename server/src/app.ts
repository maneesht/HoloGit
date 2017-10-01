import { GitPoller } from './gitpoller';
import * as express from 'express';
import { GraphQLInt, GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString, graphql } from 'graphql';
import * as graphqlHTTP from 'express-graphql';
import { routes } from './routes';
export class Server {
    public app: express.Application;
    public port = process.env.PORT || 3000;
    constructor() {
        this.app = express();
    }
}
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
        commits: {
            type: new GraphQLList(CommitQL),
            args: {
                sha: { type: GraphQLString }
            },
            resolve: (_, {sha}) => {
                if(!sha) {
                    return _.commits;
                }
                return _.commits.filter((commits: any) => commits.sha === sha);
            }
        }
    }
})
function getBranch(branchName:string) {
    return GitPoller.getBranch('maneesht', 'quiz-app', branchName);
}
let BranchesQL = new GraphQLObjectType({
    name: 'Branches',
    fields: {
        
    }
})
let server: Server = new Server();
const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        branches: {
            type: new GraphQLList(BranchQL),
            args: { id: { type: GraphQLString }},
            resolve: (_, {id}) => id ? getBranch(id) : GitPoller.getRepo('maneesht', 'quiz-app')
        },
    }
})
const schema = new GraphQLSchema({
    query: queryType
});
let app: express.Application = server.app;
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));
app.listen(server.port, () => console.log(`listening on port ${server.port}`));
app.use("/", routes);

