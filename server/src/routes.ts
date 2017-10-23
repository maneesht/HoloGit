import * as express from 'express';
import { GitPoller } from './gitpoller';

export const routes: express.Router = express.Router();
routes.get('/', (req: express.Request , res: express.Response, next: express.NextFunction) => {
    res.send('Hello World!');
});
// insert other APIs here

//Gets popular public github repositories in the last week
routes.get('/api/remote/repositories/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    GitPoller.getPopularRepos().then(data => res.send(data)).catch(data => res.send(data));
});

//Get all the public repositories of the specified user
routes.get('/api/remote/users/:username/repositories/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
    GitPoller.getReposByUser(req.params.username).then(data => res.send(data)).catch(data => res.send(data));
});

