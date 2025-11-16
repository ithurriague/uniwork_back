import server from './routes.js';
import Config, {ENV} from '../../config/config.js';

try {
    if (Config.env() === ENV.LOCAL) {
        const dotenv = await import('dotenv');
        dotenv.config();
    }

    const port = Config.port();
    server.listen(port, () => {
        console.log(`server listening on port ${port}`);
    });
} catch (err) {
    console.error('failed to start the server:', err.message);
    process.exit(1);
}