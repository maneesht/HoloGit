//import * as request from 'request';
import * as request from 'request-promise-native';
import * as q from 'q';

export class GitPoller {
    
    static option = {
        headers: {'User-agent': 'hologit/0.1'},
        json: true
    };

    static getRepo(username: string, repo: string) {
        let options = Object.assign(GitPoller.option, {
            url: `https://api.github.com/repos/${username}/${repo}/branches`
        });
        let branches: {branchId: string, commits: object, parentBranch: string}[] = [];
        return request.get(options).then((body:any) => {
            let promises:Promise<any>[] = [];
            body.forEach((branch: JSON) => {
                let promise = GitPoller.getCommits(username, repo, branch['name']).then((data: object) => {
                    branches.push({
                        branchId: branch['name'],
                        commits: data,
                        parentBranch: ''
                    });
                });
                promises.push(promise);
            });
            return q.all(promises).then(data => branches);
        });
    }

    static getBranch(username: string, repo: string, branch: string) {
        return GitPoller.getCommits(username, repo, branch).then(data => {
            return [{commits: data}];
        });
    }

    static getCommits(username: string, repo: string, branch: string) {
        let options = Object.assign(GitPoller.option, {
            url: `https://api.github.com/repos/${username}/${repo}/commits?sha=${branch}`
        });
        let commits: {sha: string, author: string, message: string, parentSha: string}[] = [];
        return request.get(options).then(body => {
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

    static getCommit(username: string, repo: string, sha: string) {
        let options = Object.assign(GitPoller.option, {
            url: `https://api.github.com/repo/${username}/${repo}/commits?sha=${sha}`
        });
        let commit: {commitId: {branchID: string, author: string, committer: string, parentSha: string}}
        return request.get(options).then(body => {
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
        });
    }

    static getPopularRepos() {
        let date = new Date((new Date()).getTime() - 604800000);
        let options = Object.assign(GitPoller.option, {
            url: `https://api.github.com/search/repositories?sort=stars&order=desc&q=created:>${date.toISOString().split('T')[0]}`
        });
        let data: {name: string, description: string, language: string, owner: string}[] = [];
        return request.get(options).then(body => {
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
        let data: {name: string, description: string, language: string, owner: string}[] = [];
        return request.get(options).then(body => {
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
}
