import * as express from 'express';
import { routes } from './routes';
export class Server {
    public app: express.Application;
    public port = process.env.PORT || 3000;
    constructor() {
        this.app = express();
    }
}
let server: Server = new Server();
let app: express.Application = server.app;
app.listen(server.port, () => console.log(`listening on port ${server.port}`));
app.use("/", routes);

