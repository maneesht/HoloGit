import { expect } from 'chai';
import sinon from 'sinon';

import {CommitQL, BranchQL, queryType, graphql, GraphQLString, GraphQLList} from '../src/app';
import { GitPoller } from '../src/gitpoller';
import * as request from 'request-promise-native'
//import {start, stop, graphqlQuery} from './testServer';
import { test1req, test1res, test1res2, test2req, test2res, test2res2, test3req, test3res, test4req, test4res} from './testReqRes'

const commitType = CommitQL;
const branchType = BranchQL;


describe('Commit', () => {
	//test schema fields
	it('Should have a sha field of type String', () => {
    expect(commitType.getFields()).to.have.property('sha');
    expect(commitType.getFields().sha.type).to.deep.equals(GraphQLString);
  });

	it('Should have a author field of type String', () => {
    expect(commitType.getFields()).to.have.property('author');
    expect(commitType.getFields().author.type).to.deep.equals(GraphQLString);
  });

	it('Should have a parentSha field of type String', () => {
    expect(commitType.getFields()).to.have.property('parentSha');
    expect(commitType.getFields().parentSha.type).to.deep.equals(GraphQLString);
  });

	it('Should have a message field of type String', () => {
    expect(commitType.getFields()).to.have.property('message');
    expect(commitType.getFields().message.type).to.deep.equals(GraphQLString);
  });
});

describe('Branch', () => {
	//test schema fields
	it('Should have a commits field of type list', () => {
    expect(branchType.getFields()).to.have.property('commits');
    expect(branchType.getFields().commits.type).to.be.an.instanceOf(GraphQLList);
  });
});

describe('Query', () => {
	//test schema fields
	it('Should have a branches field of type list', () => {
    expect(queryType.getFields()).to.have.property('branches');
    expect(queryType.getFields().branches.type).to.be.an.instanceOf(GraphQLList);
  });
});

describe('Graphql integration', () => {
  let app: any;

	it('Should return two branches of a simple repo', () => {
		//github.com/maneesht/todo-app
    const query = test1req;

		const expectedString = JSON.stringify(test1res);
		const expectedString2 = JSON.stringify(test1res2);

		return request(`http://holo-git.herokuapp.com/graphql?query=${query}`).then((response) => {
			// expect(response).equal(expectedString) || expect(response).equal(expectedString2);
			expect([expectedString, expectedString2]).to.include(response);
		});
  });

	it('Should return two branches and their commits\' shas of a simple repo', () => {
		//github.com/maneesht/todo-app
    const query = test2req;

		const expectedString = JSON.stringify(test2res);
		const expectedString2 = JSON.stringify(test2res2);

		return request(`http://holo-git.herokuapp.com/graphql?query=${query}`).then((response) => {
			// expect(response).equal(expectedString) || expect(response).equal(expectedString2);
			expect([expectedString, expectedString2]).to.include(response);
		});
  });

	it('Should return all the information of a repo', () => {
		//github.com/maneesht/todo-app
    const query = test3req;

		const expectedString = JSON.stringify(test3res);

		return request(`http://holo-git.herokuapp.com/graphql?query=${query}`).then((response) => {
			expect(response).equal(expectedString);
		});
  });

	it('Should return all the information of a specific branch of a repo', () => {
		//github.com/maneesht/todo-app
    const query = test4req;

		const expectedString = JSON.stringify(test4res);

		return request(`http://holo-git.herokuapp.com/graphql?query=${query}`).then((response) => {
			expect(response).equal(expectedString);
		});
  });


});
