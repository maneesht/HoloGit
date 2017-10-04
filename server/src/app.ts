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
            args: {
                username: { type: GraphQLString },
                repo: { type: GraphQLString },
                branchName: { type: GraphQLString },
            },
            resolve: (_, { repo, username, branchName }) => {
                if (branchName) {
                    return GitPoller.getBranch(username, repo, branchName);
                }
                return GitPoller.getRepo(username, repo)
            }
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

export { CommitQL, BranchQL, queryType, graphql, GraphQLString, GraphQLList };
