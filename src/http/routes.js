import ApplicationRoutes from '../../modules/applications/adapters/http/routes.js';
import CategoryRoutes from '../../modules/categories/adapters/http/routes.js';
import HealthcheckRoutes from '../../modules/healthcheck/adapters/http/routes.js';
import PositionRoutes from '../../modules/positions/adapters/http/routes.js';
import RatingRoutes from '../../modules/ratings/adapters/http/routes.js';
import UserRoutes from '../../modules/users/adapters/http/routes.js';

export default function register(server, container) {
    server.use('', HealthcheckRoutes(container));
    server.use('', CategoryRoutes(container));
    server.use('', UserRoutes(container));
    server.use('', PositionRoutes(container));
    server.use('', ApplicationRoutes(container));
    server.use('', RatingRoutes(container));
}
