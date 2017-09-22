import * as express from 'express';

export const routes: express.Router = express.Router();
routes.get('/', (req: express.Request , res: express.Response, next: express.NextFunction) => {
    res.send('Hello World!');
});
// insert other APIs here
