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
                sha: { type: GraphQLInt! }
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
function getBranch(sha:number) {
    return repo.branches.filter(branch => branch.branchId === sha);
}
let BranchesQL = new GraphQLObjectType({
    name: 'Branches',
    fields: {
        
    }
})
let repo = {
    branches: [
        {
            branchId: 1,
            commits: [
                {
                    sha: 3433434234,
                    author: "Maneesh",
                    message: "Create stuff",
                    parentSha: 3444344
                },
                {
                    sha: 3444344,
                    author: "Drew",
                    message: "Create stuff 2",
                    parentSha: 343432232
                },
                {
                    sha: 343432232,
                    author: "Ben",
                    message: "Create stuff 3"
                }
            ]
        }
    ]
};
let server: Server = new Server();
const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        branch: {
            type: BranchQL,
            args: {
                id: { type: GraphQLInt }
            },
            resolve: function(_, {id}) {
                return repo.branches[id];
            }
        },
        branches: {
            type: new GraphQLList(BranchQL),
            args: { id: { type: GraphQLInt }},
            resolve: (_, {id}) => id ? getBranch(id) : repo.branches
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

