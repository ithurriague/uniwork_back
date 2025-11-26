import {ROLES} from '../../common/auth/roles.js';

export default class Service {
    constructor(
        userRepository,
        rolesRepository,
    ) {
        this.userRepository = userRepository;
        this.rolesRepository = rolesRepository;
    }

    async getAll(filter) {
        return this.userRepository.getAll(filter);
    }

   async getByID(id, userType) {
        return this.userRepository.getByID(id, userType);
   }

    async create(user) {
        const result = {
            error: null,
        };

        const {roles, error: errGetAll} = await this.rolesRepository.getAll();
        if (errGetAll) {
            result.error = errGetAll;
            return result;
        }

        const rolesIDS = Object.fromEntries(roles.map(row => [row.key, row.id]));
        user.rolesID = rolesIDS[ROLES.ORGANIZATION];
        if (!user.rolesID) {
            result.error = 'role id not found';
            return result;
        }

        const {error: errCreate} = await this.userRepository.create(user);
        if (errCreate) {
            result.error = errCreate;
            return result;
        }

        return result;
    }

}
