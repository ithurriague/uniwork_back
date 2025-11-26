import getPool from '../../common/db/postgresql.js';
import HealthcheckController from '../../modules/healthcheck/adapters/http/controller.js';
import HealthcheckRepository from '../../modules/healthcheck/repository.js';
import HealthcheckService from '../../modules/healthcheck/service.js';
import RoleRepository from '../../modules/roles/repository.js';
import UserController from '../../modules/users/adapters/http/controller.js';
import UserRepository from '../../modules/users/repository.js';
import UserService from '../../modules/users/service.js';

export default function build() {
    // Healthcheck
    const healthcheckRepository = new HealthcheckRepository(getPool());
    const healthcheckService = new HealthcheckService(healthcheckRepository);
    const healthcheckController = new HealthcheckController(healthcheckService);

    // Role
    const roleRepository = new RoleRepository(getPool());

    // User
    const userRepository = new UserRepository(getPool());
    const userService = new UserService(userRepository, roleRepository);
    const userController = new UserController(userService);

    return {
        HealthcheckController: healthcheckController,
        UserController: userController,
    };
}

