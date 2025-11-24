import server from './routes.js';
import log from '../../common/log/pino.js';
import Config, {ENV} from '../../config/config.js';

try {
    if (Config.env() === ENV.LOCAL) {
        const dotenv = await import('dotenv');
        dotenv.config();
    }

    const port = Config.port();
    server.listen(port, () => {
        log.info(`server listening on port ${port}`);
    });
} catch (err) {
    log.error(err, 'failed to start the server');
    process.exit(1);
}