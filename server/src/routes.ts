import * as express from 'express';
import { GitPoller } from './gitpoller';

export const routes: express.Router = express.Router();
routes.get('/', (req: express.Request , res: express.Response, next: express.NextFunction) => {
    res.send('Hello World!');
});
// insert other APIs here

routes.get('/api/rate-limit', (req, res, next) => {
    GitPoller.getRateLimit(req.session.authorization).then(data => res.send(data)).catch(data => res.status(400).send("Error, could not retrieve rate limit"));
})

//Gets popular public github repositories in the last week
routes.get('/api/remote/repositories/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    GitPoller.getPopularRepos().then(data => res.send(data)).catch(data => res.status(400).send(data));
});

//Get all the public repositories of the specified user
routes.get('/api/remote/users/:username/repositories/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    let auth = req.session.authorization;
    console.log("AUTH: ", auth);
    GitPoller.getReposByUser(req.params.username, req.session.authorization).then(data => res.send(data)).catch(data => res.status(400).send(data));
});

routes.get('/api/remote/users/:username/:repository/pull-requests', (req, res, next) => {
    let auth = req.session.authorization;
    GitPoller.getPullRequests(req.params.username, req.params.repository, req.session.authorization).then(data => res.send({requests: data})).catch(data => res.status(400).send(data));
})

