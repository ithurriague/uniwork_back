import server from './routes.js';
import Config from '../../config/config.js';

try {
    const port = Config.port();
    server.listen(port, () => {
        console.log(`server listening on port ${port}`);
    });
} catch (err) {
    console.error('failed to start the server:', err.message);
    process.exit(1);
}