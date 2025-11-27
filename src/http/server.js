import express from 'express';

import registerRoutes from './routes.js';
import log from '../../common/log/pino.js';
import Config from '../../config/config.js';
import build from '../http/container.js';


try {
    const server = express();
    server.use(express.json());
    const container = build();

    registerRoutes(server, container);
    server.use(container.ErrorMiddleware.onError);

    const port = Config.port();
    server.listen(port, () => {
        log.info(`server listening on port ${port}`);
    });
} catch (err) {
    log.error(err, 'failed to start the server');
    process.exit(1);
}