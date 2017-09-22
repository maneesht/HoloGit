import * as express from 'express';
import { routes } from './routes';
export class Server {
    public app: express.Application;

    constructor() {
        this.app = express();
    }
}
let server: Server = new Server();
let app: express.Application = server.app;
app.listen(3000, () => console.log('listening'));
app.use("/", routes);

