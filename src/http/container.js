import NodeCache from 'node-cache';

import getPool from '../../common/db/postgresql.js';
import log from '../../common/log/pino.js';
import CategoryController from '../../modules/categories/adapters/http/controller.js';
import CategoryRepository from '../../modules/categories/repository.js';
import CategoryService from '../../modules/categories/service.js';
import HealthcheckController from '../../modules/healthcheck/adapters/http/controller.js';
import HealthcheckRepository from '../../modules/healthcheck/repository.js';
import HealthcheckService from '../../modules/healthcheck/service.js';
import PositionController from '../../modules/positions/adapters/http/controller.js';
import PositionRepository from '../../modules/positions/repository.js';
import PositionService from '../../modules/positions/service.js';
import RoleRepository from '../../modules/roles/repository.js';
import RoleService from '../../modules/roles/service.js';
import UserController from '../../modules/users/adapters/http/controller.js';
import UserRepository from '../../modules/users/repository.js';
import UserService from '../../modules/users/service.js';
import AuthorizeMiddleware from '../../src/http/middlewares/authorize.js';
import ErrorMiddleware from '../../src/http/middlewares/on_error.js';

export default function build() {
    // Cache
    const cache = new NodeCache({stdTTL: 60, checkperiod: 120});

    // Healthcheck
    const healthcheckRepository = new HealthcheckRepository(getPool());
    const healthcheckService = new HealthcheckService(healthcheckRepository);
    const healthcheckController = new HealthcheckController(healthcheckService);

    // Category
    const categoryRepository = new CategoryRepository(getPool());
    const categoryService = new CategoryService(categoryRepository);
    const categoryController = new CategoryController(categoryService);
    // Role
    const roleRepository = new RoleRepository(getPool());
    const roleService = new RoleService(roleRepository);

    // User
    const userRepository = new UserRepository(getPool(), cache);
    const userService = new UserService(userRepository, roleService);
    const userController = new UserController(userService);

    // Position
    const positionRepository = new PositionRepository(getPool(), cache);
    const positionService = new PositionService(positionRepository, categoryService);
    const positionController = new PositionController(positionService);

    // Middlewares
    const errorMiddleware = new ErrorMiddleware(log);
    const authorizeMiddleware = new AuthorizeMiddleware(roleService, userService);

    return {
        Cache: cache,
        HealthcheckController: healthcheckController,
        CategoryController: categoryController,
        UserController: userController,
        PositionController: positionController,
        ErrorMiddleware: errorMiddleware,
        AuthorizeMiddleware: authorizeMiddleware,
    };
}

