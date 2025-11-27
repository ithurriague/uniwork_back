import {ERROR} from '../../../common/auth/errors.js';
import {ForbiddenError, UnauthorizedError} from '../../../common/http/errors.js';

export default class Middleware {
    constructor(
        roleService,
        userService,
    ) {
        this.roleService = roleService;
        this.userService = userService;
    }

    /**
     * @param {...string} requiredPermissionKeys
     */
    requires(...requiredPermissionKeys) {
        return async (req, res, next) => {
            // Validate
            if (!req.token) {
                return next(new UnauthorizedError(ERROR.MISSING_REQUEST_TOKEN));
            }

            // Get user
            const {user} = await this.userService.getByUID(req.token.uid);
            const roleID = user.roles_id;
            if (!roleID || typeof roleID !== 'number') {
                return next(new ForbiddenError(ERROR.MISSING_USER_ROLE));
            }

            // Get role and permissions
            const {role, permissions} = await this.roleService.getByID(roleID);

            // Authorized?
            const permissionKeys = permissions.map(p => p.key);
            const isAuthorized = requiredPermissionKeys.every(p =>
                permissionKeys.includes(p),
            );
            if (!isAuthorized) {
                return next(new ForbiddenError(ERROR.INSUFFICIENT_PERMISSIONS));
            }

            // Attach to request
            req.user = user;
            req.role = role.role;

            return next();
        };
    }
}

