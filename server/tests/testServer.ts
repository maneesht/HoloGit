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

    app.get('/graphql', (req, res) => {
			const graphqlQuery = req.query.graphqlQuery;
			if (!graphqlQuery) {
				return res.status(500).send('you must provide a query');
			}

			return graphql(schema, graphqlQuery)
				.then(response => response.data)
				.then((data) => res.json(data))
				.catch((err) => console.log(err));

		});

    return app.listen(PORT, () => {
        // console.log(`listening on port ${PORT}`);
        done();
    });

}

export function stop(app: any, done: any) {
    app.close();
    done();
}

export function graphqlQuery(app: any, query: any) {
	  return request({
				baseUrl: `http://localhost:3000`,
				uri: `/graphql?query=${query}`,
	      resolveWithFullResponse: true,
	      json: true
	  });
}
