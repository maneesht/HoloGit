//import * as request from 'request';
import * as request from 'request-promise-native';
import * as q from 'q';

const GITHUB_CLIENT_ID = 'f10bae450fbb2df2d082';
const GITHUB_CLIENT_SECRET = 'b63e9226988bf692208873846b396a6bddf70698';
interface AccessTokenMap {
    [ip:string]: string;
}
export class GitPoller {
    static accessTokens:AccessTokenMap = {};
    static option = {
        headers: {'User-agent': 'hologit/0.1'},
        json: true,
        qs: {
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            access_token: ''
        },
        resolveWithFullResponse: true
    };

    static addAccessToken(ip: string, accessToken: string) {
        this.accessTokens[ip] = accessToken;
    }
    static getRepo(username: string, repo: string, ip: string) {
        let accessToken = this.accessTokens[ip];
        let options = Object.assign(GitPoller.option, {
            url: `https://api.github.com/repos/${username}/${repo}/branches`
        });
        options.qs.access_token = accessToken;
        let branches: {branchId: string, commits: object, parentBranch: string}[] = [];
        return request.get(options).then(response => {
            let body = response.body;
            let promises:Promise<any>[] = [];
            body.forEach((branch: JSON) => {
                let promise = GitPoller.getCommits(username, repo, branch['name'], ip).then((data: object) => {
                    branches.push({
                        branchId: branch['name'],
                        commits: data,
                        parentBranch: ''
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

    static getBranch(username: string, repo: string, branch: string, ip: string) {
        let branchInfo: {branchID: {commits: object}} = {branchID: {commits: {}}};
        return GitPoller.getCommits(username, repo, branch,ip).then(data => {
            if (data.hasOwnProperty('errorCode')) {
                throw data;
            }
            branchInfo.branchID.commits = data;
            return branchInfo;
        }).catch(error => {
            return error;
        });
    }

    static getCommits(username: string, repo: string, branch: string, ip: string) {
        let accessToken = this.accessTokens[ip];
        let options = Object.assign(GitPoller.option, {
            url: `https://api.github.com/repos/${username}/${repo}/commits?sha=${branch}`
        });
        options.qs.access_token = accessToken;
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

    static getCommit(username: string, repo: string, sha: string, ip: string) {
        let accessToken = this.accessTokens[ip];
        let options = Object.assign(GitPoller.option, {
            url: `https://api.github.com/repo/${username}/${repo}/commits?sha=${sha}`,
            access_token: accessToken
        });
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
        let data: {name: string, description: string, language: string, owner: string}[] = [];
        return request.get(options).then(response => {
            let body = response.body;
            body['items'].forEach((repo: JSON) => {
                data.push({
                    name: repo['name'],
                    description: repo['description'],
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
        let data: {name: string, description: string, language: string, owner: string}[] = [];
        return request.get(options).then(response => {
            let body = response.body;
            body.forEach((repo: JSON) => {
                data.push({
                    name: repo['name'],
                    description: repo['description'],
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
