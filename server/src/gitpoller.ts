//import * as request from 'request';
import * as request from 'request-promise-native';
import * as q from 'q';

const GITHUB_CLIENT_ID = 'f10bae450fbb2df2d082';
const GITHUB_CLIENT_SECRET = 'b63e9226988bf692208873846b396a6bddf70698';
export interface Commit {
    sha: string,
    parentSha: string;
    author: string,
    message: string
}
export interface Branch  {
    id: string;
    commits: Commit[];
}

interface HeaderOptional {
    'User-agent': string;
    Authorization: string;
}
export class GitPoller {
    static option = {
        headers: <HeaderOptional> {'User-agent': 'hologit/0.1'},
        json: true,
        
        resolveWithFullResponse: true
    };

    static getRepo(username: string, repo: string, auth?: string) {
        let options = Object.assign(GitPoller.option, {
            url: `https://api.github.com/repos/${username}/${repo}/branches`
        });
        if(auth) {
            options.headers.Authorization = auth;
        }
        let branches: Branch[] = [];
        return request.get(options).then(response => {
            let body = response.body;
            let promises:Promise<any>[] = [];
            body.forEach((branch: JSON) => {
                let promise = GitPoller.getCommits(username, repo, branch['name'], auth).then((data: Commit[]) => {
                    branches.push({
                        id: branch['name'],
                        commits: data
                    });
                });
                promises.push(promise);
            });
            return q.all(promises).then(data => branches);
        }).catch(error => {
            return {
                errorCode: error.statusCode,
                errorMessage: error.error.message
            };
        });
    }

    
    static getBranch(username: string, repo: string, branch: string, auth?: string) {
        return GitPoller.getCommits(username, repo, branch,auth).then(data => {
            if (data.hasOwnProperty('errorCode')) {
                throw data;
            }
            let branchInfo = {
                branchID: branch,
                commits: data
            };
            return [branchInfo];
        }).catch(error => {
            return error;
        });
    }

    static getCommits(username: string, repo: string, branch: string, auth: string) {
        let options = Object.assign(GitPoller.option, {
            url: `https://api.github.com/repos/${username}/${repo}/commits?sha=${branch}`
        });
        if(auth)
            options.headers.Authorization = auth;
        let commits: {sha: string, author: string, message: string, parentSha: string}[] = [];
        return request.get(options).then(response => {
            let body = response.body;
            body.forEach((commit: JSON) => {
                let pSha: string = '';
                if (commit['parents'].length != 0) {
                    pSha = commit['parents'][0]['sha'];
                }
                commits.push({
                    sha: commit['sha'],
                    author: commit['commit']['author']['name'],
                    message: commit['commit']['message'],
                    parentSha: pSha
                });
            });
            return commits;
        }).catch(error => {
            return {
                errorCode: error.statusCode,
                errorMessage: error.error.message
            };
        });
    }

    static getCommit(username: string, repo: string, sha: string, auth?: string) {
        let options = Object.assign(GitPoller.option, {
            url: `https://api.github.com/repo/${username}/${repo}/commits?sha=${sha}`
        });
        if(auth)
            options.headers.Authorization = auth;
        let commit: {commitId: {branchID: string, author: string, committer: string, parentSha: string}}
        return request.get(options).then(response => {
            let body = response.body;
            let pSha: string = '';
            if (body['parents'].length != 0) {
                pSha = body['parents'][0]['sha'];
            }
            commit.commitId = {
                branchID: '',
                author: body['commit']['author']['name'],
                committer: body['commit']['committer']['name'],
                parentSha: pSha
            };
            return commit
        }).catch(error => {
            return {
                errorCode: error.statusCode,
                errorMessage: error.error.message
            };
        });
    }

    static getPopularRepos() {
        let date = new Date((new Date()).getTime() - 604800000);
        let options = Object.assign(GitPoller.option, {
            url: `https://api.github.com/search/repositories?sort=stars&order=desc&q=created:>${date.toISOString().split('T')[0]}`
        });
        let data: {name: string, descrauthtion: string, language: string, owner: string}[] = [];
        return request.get(options).then(response => {
            let body = response.body;
            body['items'].forEach((repo: JSON) => {
                data.push({
                    name: repo['name'],
                    descrauthtion: repo['description'],
                    language: repo['language'],
                    owner: repo['owner']['login']
                });
            });
            return data;
        }).catch(error => {
            return {
                errorCode: error.statusCode,
                errorMessage: error.error.message
            };
        });
    }

    static getReposByUser(username: string) {
        let options = Object.assign(GitPoller.option, {
            url: `https://api.github.com/users/${username}/repos`
        });
        let data: {name: string, descrauthtion: string, language: string, owner: string}[] = [];
        return request.get(options).then(response => {
            let body = response.body;
            body.forEach((repo: JSON) => {
                data.push({
                    name: repo['name'],
                    descrauthtion: repo['description'],
                    language: repo['language'],
                    owner: repo['owner']['login']
                });
            });
            return data;
        }).catch(error => {
            return {
                errorCode: error.statusCode,
                errorMessage: error.error.message
            };
        });
    }
}
