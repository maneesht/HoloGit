import { expect } from 'chai';
import sinon from 'sinon';

import {CommitQL, BranchQL, queryType, graphql, GraphQLString, GraphQLList} from '../src/app';
import { GitPoller } from '../src/gitpoller';
import * as request from 'request-promise-native'
import {start, stop, graphqlQuery} from './testServer';
import { test1req, test1res, test1res2, test2req, test2res, test2res2, test3req, test3res, test4req, test4res} from './testReqRes';

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

	before((done) => {
		app = start(done, null);
	})

	after((done) => {
		stop(app, done);
	})

	it('Should return two branches of a simple repo', () => {
		//github.com/maneesht/todo-app
    const query = test1req;

		const expectedString = test1res;
		const expectedString2 = test1res2;

		return graphqlQuery(app, query).then((response) => {
			// expect(response).equal(expectedString) || expect(response).equal(expectedString2);
			expect([expectedString, expectedString2]).to.have.deep.include(response.body);
		});
  });

	it('Should return two branches and their commits\' shas of a simple repo', () => {
		//github.com/maneesht/todo-app
    const query = test2req;

		const expectedString = test2res;
		const expectedString2 = test2res2;

		return graphqlQuery(app, query).then((response) => {
			expect([test2res, test2res2]).to.have.deep.include(response.body);
		});
  });

	it('Should return all the information of a repo', () => {
		//github.com/maneesht/todo-app
    const query = test3req;

		const expectedString = test3res;

		return graphqlQuery(app, query).then((response) => {
			expect(response.body).to.have.deep.equals(test3res);
		});
  });

	it('Should return all the information of a specific branch of a repo', () => {
		//github.com/maneesht/todo-app
    const query = test4req;

		const expectedString = test4res;

		return graphqlQuery(app, query).then((response) => {
			expect(response.body).to.have.deep.equals(test4res);
		});
  });
});

describe('GitPoller: Contributors', () => {
	
	it('shoud return an array', () => {
		//github.com/maneesht/todo-app
		return GitPoller.getContributors('maneesht', 'todo-app').then((data) => {
			expect(data).to.be.an('array');
		});
	});

	it('should only contain usernames', () => {
		//github.com/maneesht/todo-app
		return GitPoller.getContributors('maneesht', 'todo-app').then((data: Array<any>) => {
			data.forEach((user) => {
				expect(user).to.be.a('string');
			});
		});
	});

	it('should contain 2 users', () => {
		//github.com/maneesht/todo-app
		return GitPoller.getContributors('maneesht', 'todo-app').then(data =>{
			expect(data).to.be.an('array').of.length(2);
		});
	});

	it('should contain the correct users', () => {
		//github.com/maneesht/todo-app
		let expected = ['maneesht', 'angular-cli'];
		return GitPoller.getContributors('maneesht', 'todo-app').then((data) => {
			expect(data).to.have.same.members(expected);
		});
	});
});

describe('GitPoller: Commits by User', () => {
	it('should return an array', () => {
		//github.com/maneesht/todo-app
		return GitPoller.getCommitsByUser('maneesht', 'todo-app', 'maneesht').then(data => {
			expect(data).to.be.an('array');
		});
	});

	it('should contain the appropriate keys for each commit', () => {
		//github.com/maneesht/todo-app
		return GitPoller.getCommitsByUser('maneesht', 'todo-app', 'maneesht').then((data: Array<object>) => {
			data.forEach((commit: object) => {
				expect(commit).to.have.all.keys(['sha', 'author', 'message', 'parentSha']);
			});
		});
	});

	it('should contain 5 commits', () => {
		//github.com/maneesht/todo-app
		return GitPoller.getCommitsByUser('maneesht', 'todo-app', 'maneesht').then(data => {
			expect(data).to.have.lengthOf(5);
		});
	});

	it('should contain the correct commits', () => {
		//github.com/maneesht/todo-app
		let expected = [{
			sha: '515303528685e1ff575824ab6c187fef19e07334',
			author: 'maneesht',
			message: 'Separated todo app',
			parentSha: '3d1c24c101b7e3cb9755acc6e1cf03a137c3adc5'
		}, {
			sha: '3d1c24c101b7e3cb9755acc6e1cf03a137c3adc5',
			author: 'maneesht',
			message: 'Modularized State Management',
			parentSha: '6ba70d5827147ac91ee6e16196d625971d5e5790'
		}, {
			sha: '6ba70d5827147ac91ee6e16196d625971d5e5790',
			author: 'maneesht',
			message: 'Fixed layout and socket update',
			parentSha: 'f61f2bc354c25b68869e51ac4fa0cf756a991072'
		}, {
			sha: 'f61f2bc354c25b68869e51ac4fa0cf756a991072',
			author: 'maneesht',
			message: 'Persistent Firebase storage now works.',
			parentSha: '4c88e185398f6f165880188324605cb7fc6a5a39'
		}, {
			sha: '4c88e185398f6f165880188324605cb7fc6a5a39',
			author: 'maneesht',
			message: 'Initial Commit',
			parentSha: 'd15052a8b84fbbebf07e1aea925f09915a8c9d45'
		}]
		return GitPoller.getCommitsByUser('maneesht', 'todo-app', 'maneesht').then(data => {
			expect(data).to.deep.equal(expected)
		})
	});
});