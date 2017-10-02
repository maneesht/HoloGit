import chai from 'chai';
import sinon from 'sinon';

import {CommitQL, BranchQL, queryType, graphql, GraphQLString, GraphQLList} from '../src/app';
import { GitPoller } from '../src/gitpoller';

const commitType = CommitQL;
const branchType = BranchQL;
const expect = chai.expect;

describe('Commit', () => {
	//test schema fields
	it('Should have a sha field of type String', () => {
    expect(commitType.getFields()).to.have.property('sha');
    expect(commitType.getFields().id.type).to.deep.equals(GraphQLString);
  });

	it('Should have a author field of type String', () => {
    expect(commitType.getFields()).to.have.property('author');
    expect(commitType.getFields().id.type).to.deep.equals(GraphQLString);
  });

	it('Should have a parentSha field of type String', () => {
    expect(commitType.getFields()).to.have.property('parentSha');
    expect(commitType.getFields().id.type).to.deep.equals(GraphQLString);
  });

	it('Should have a message field of type String', () => {
    expect(commitType.getFields()).to.have.property('message');
    expect(commitType.getFields().id.type).to.deep.equals(GraphQLString);
  });
});

describe('Branch', () => {
	//test schema fields
	it('Should have a commits field of type list', () => {
    expect(branchType.getFields()).to.have.property('commits');
    expect(branchType.getFields().id.type).to.deep.equals(GraphQLList);
  });
});

describe('Query', () => {
	//test schema fields
	it('Should have a branches field of type list', () => {
    expect(queryType.getFields()).to.have.property('branches');
    expect(queryType.getFields().id.type).to.deep.equals(GraphQLList);
  });
});
