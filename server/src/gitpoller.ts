import * as request from 'request-promise-native';
import * as q from 'q';
import * as _ from 'lodash';

export interface Commit {
    sha: string,
    parentSha: string;
    author: string,
    message: string
}
export interface Branch {
    id: string;
    commits: Commit[];
}

interface HeaderOptional {
    'User-agent': string;
    Authorization?: string;
}
export class GitPoller {
    static option = {
        headers: <HeaderOptional>{ 'User-agent': 'hologit/0.1' },
        json: true,
        resolveWithFullResponse: true,
        url: ''
    };

    static getRepo(username: string, repo: string, auth?: string) {
        let options = _.cloneDeep(GitPoller.option);
        options.url = `https://api.github.com/repos/${username}/${repo}/branches`;
        if (auth) {
            options.headers.Authorization = auth;
        }
        let branches: Branch[] = [];
        return request.get(options).then(response => {
            let body = response.body;
            let promises: Promise<any>[] = [];
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
        })
    }


    static getBranch(username: string, repo: string, branch: string, auth?: string) {
        return GitPoller.getCommits(username, repo, branch, auth).then(data => {
            if (data.hasOwnProperty('errorCode')) {
                throw data;
            }
            let branchInfo = {
                id: branch,
                commits: data
            };
            return [branchInfo];
        }).catch(error => {
            return error;
        });
    }

    static getCommits(username: string, repo: string, branch: string, auth: string) {
        let options = _.cloneDeep(GitPoller.option);
        options.url = `https://api.github.com/repos/${username}/${repo}/commits?sha=${branch}`;
        if (auth) {
            options.headers.Authorization = auth;
        }
        //options.qs.access_token = accessToken;
        let commits: Commit[] = [];
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
        });
    }

    static getCommit(username: string, repo: string, sha: string, auth?: string) {
        let options = _.cloneDeep(GitPoller.option);
        options.url = `https://api.github.com/repo/${username}/${repo}/commits?sha=${sha}`;
        if (auth) {
            options.headers.Authorization = auth;
        }
        let commit: { commitId: { id: string, author: string, committer: string, parentSha: string } }
        return request.get(options).then(response => {
            let body = response.body;
            let pSha: string = '';
            if (body['parents'].length != 0) {
                pSha = body['parents'][0]['sha'];
            }
            commit.commitId = {
                id: '',
                author: body['commit']['author']['name'],
                committer: body['commit']['committer']['name'],
                parentSha: pSha
            };
            return commit
        });
    }

    static getPopularRepos() {
        let date = new Date((new Date()).getTime() - 604800000);
        let options = Object.assign(GitPoller.option, {
            url: `https://api.github.com/search/repositories?sort=stars&order=desc&q=created:>${date.toISOString().split('T')[0]}`
        });
        let data: { name: string, description: string, language: string, owner: string }[] = [];
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
        });
    }

    static getReposByUser(username: string) {
        let options = Object.assign(GitPoller.option, {
            url: `https://api.github.com/users/${username}/repos`
        });
        let data: { name: string, description: string, language: string, owner: string }[] = [];
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
        });
    }

    static getContributors(username: string, repo: string) {
        let options = Object.assign(GitPoller.option, {
            url: `https://api.github.com/repos/${username}/${repo}/stats/contributors`
        });
        let contributors: Array<string> = [];
        return request.get(options).then(response => {
            let body = response.body;
            body.forEach((user: JSON) => {
                contributors.push(user['author']['login']);
            });
            return contributors
        });
    }

    static getRateLimit(auth:string) {
        let options = Object.assign(GitPoller.option, {
            url: 'https://api.github.com/rate_limit'
        });
        let newOptions = _.cloneDeep(options);
        if(auth) {
            newOptions.headers.Authorization = auth;
        }
        return request.get(newOptions).then(response => response.body);
    }

    static getCommitsByUser(username: string, repo: string, userFilter: string) {
        let options = Object.assign(GitPoller.option, {
            url: `https://api.github.com/repos/${username}/${repo}/commits?author=${userFilter}`
        });
        let commits: { sha: string, author: string, message: string, parentSha: string }[] = [];
        return request.get(options).then(response => {
            let body = response.body;
            body.forEach((commit: JSON) => {
                let pSha: string = '';
                if (commit['parents'].length != 0) {
                    pSha = commit['parents'][0]['sha'];
                }
                commits.push({
                    sha: commit['sha'],
                    author: commit['author']['login'],
                    message: commit['commit']['message'],
                    parentSha: pSha
                });
            });
            return commits;
        });
    }

    static getPullRequests(username: string, repo:string) {
        let options = Object.assign(GitPoller.option, {
            url: `https://api.github.com/repos/${username}/${repo}/pulls`
        });
        let data: {number: number, title: string, body: string, assignee: string, user: string, state: string}[] = [];
        return request.get(options).then(response => {
            let body = response.body;
            body.forEach((pullrequest: JSON) => {
                let assigneeLogin: string = '';
                if (pullrequest['assignee'] && pullrequest['assignee']['login'].length != 0) {
                    assigneeLogin = body['assignee']['login'];
                }
                data.push({
                    number: pullrequest['number'],
                    title: pullrequest['title'],
                    body: pullrequest['body'],
                    assignee: assigneeLogin,
                    user: pullrequest['user']['login'],
                    state: pullrequest['state']
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
