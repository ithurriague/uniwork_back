import {ROLES} from '../../common/auth/roles.js';

export default class Service {
    constructor(
        userRepository,
        roleService,
    ) {
        this.userRepository = userRepository;
        this.roleService = roleService;
    }

    async getAll(filter) {
        return this.userRepository.getAll(filter);
    }

   async getByID(id) {
        return this.userRepository.getByID(id);
   }

    async getByUID(uid) {
        return this.userRepository.getByUID(uid);
    }

    async create(user) {
        const result = {
            error: null,
        };

        const {roles, error: errGetAll} = await this.roleService.getAll();
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
