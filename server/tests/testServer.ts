import * as express from 'express';
import {GraphQLInt, GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLString, graphql } from 'graphql';
import {CommitQL, BranchQL, queryType} from '../src/app'
import * as request from 'request-promise-native'
import * as graphqlHTTP from 'express-graphql';

const schema = new GraphQLSchema({
    query: queryType
});

export function start(done: any, appPort: number) {
    const app = express();
    const PORT = appPort || 3030;

    app.get('graphql', graphqlHTTP({
        schema: schema,
        graphiql: true
    }));

    return app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
        done();
    });

}

export function stop(app: any, done: any) {
    app.close();
    done();
}

export function graphqlQuery(app: any, query: any) {
    // let options = {
		// 		url: `http://localhost:${app.address().port}/graphql?query=${query}`,
		// 		// baseUrl : `http://localhost:${app.address().port}`,
    //     // uri : '/graphql',
    //     // qs : {graphqlQuery : query},
    //     resolveWithFullResponse: true,
    //     json: true
    // }
    // return request(options);
		return request(`http://localhost:${app.address().port}/graphql?query=${query}`);
}
