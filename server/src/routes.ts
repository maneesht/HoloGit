import * as express from 'express';
import * as request from 'request';
import { GitPoller } from './gitpoller';

export const routes: express.Router = express.Router();
routes.get('/', (req: express.Request , res: express.Response, next: express.NextFunction) => {
    res.send('Hello World!');
});
// insert other APIs here

//Gets popular public github repositories in the last week
routes.get('/api/remote/repositories/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    GitPoller.getPopularRepos().then(data => res.send(data));
});

//Get all the public repositories of the specified user
routes.get('/api/remote/users/:username/repositories/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    GitPoller.getReposByUser(req.params.username).then(data => res.send(data));
});

routes.get('/api/remote/users/:username/repositories/:repo', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    GitPoller.getRepo(req.params.username, req.params.repo).then(data => res.send(data));
});

routes.get('/api/remote/users/:username/repositories/:repo/branches/:branch', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    GitPoller.getBranch(req.params.username, req.params.repo, req.params.branch).then(data => res.send(data));
});

routes.get('/api/remote/users/:username/repositories/:repo/branches/:branch/commits', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    GitPoller.getCommits(req.params.username, req.params.repo, req.params.branch).then(data => res.send(data));
});

routes.get('/api/remote/users/:username/repositories/:repo/commits/:commit', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    GitPoller.getCommit(req.params.username, req.params.repo, req.params.commit).then(data => res.send(data));
});