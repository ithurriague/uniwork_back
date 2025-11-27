import {ROLES} from '../../common/auth/roles.js';
import {BadRequestError, ForbiddenError} from '../../common/http/errors.js';
import {USER_TYPE} from '../../common/types/user_type.js';

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
        const {roles} = await this.roleService.getAll();
        const rolesIDS = Object.fromEntries(roles.map(row => [row.key, row.id]));

        const userTypeToRoleKey = {
            [USER_TYPE.STUDENT]: ROLES.STUDENT,
            [USER_TYPE.ORGANIZATION]: ROLES.ORGANIZATION,
        };

        const roleKey = userTypeToRoleKey[user.type];
        const roleID = rolesIDS[roleKey];

        if (!roleID) {
            throw new BadRequestError('user type not supported');
        }

        return await this.userRepository.create({
            ...user,
            rolesID: roleID,
        });
    }

    async deleteByID(id, uid) {
        const {user} = await this.userRepository.getByUID(uid);
        if (user.id !== id) {
            throw new ForbiddenError(`user id ${user.id} can only delete itself`);
        }

        return this.userRepository.deleteByID(id);
    }
}
