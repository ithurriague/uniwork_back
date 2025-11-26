import HealthcheckRoutes from '../../modules/healthcheck/adapters/http/routes.js';
import UserRoutes from '../../modules/users/adapters/http/routes.js';

export default function register(server, container) {
    server.use('', HealthcheckRoutes(container));
    server.use('', UserRoutes(container));
}
