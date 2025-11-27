import {ERROR} from '../../../common/auth/errors.js';
import {HTTP_STATUS} from '../../../common/http/status.js';
import log from '../../../common/log/pino.js';

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
            try {
                // Validate
                if (!req.token) {
                    return res.status(HTTP_STATUS.UNAUTHORIZED).json({error: ERROR.MISSING_REQUEST_TOKEN});
                }

                // Get user
                const {user} = await this.userService.getByUID(req.token.uid);
                const roleID = user.roles_id;
                if (!roleID || typeof roleID !== 'number') {
                    return res.status(HTTP_STATUS.FORBIDDEN).json({error: ERROR.MISSING_USER_ROLE});
                }

                // Get role and permissions
                const {role, permissions} = await this.roleService.getByID(roleID);

                // Authorized?
                const permissionKeys = permissions.map(p => p.key);
                const isAuthorized = requiredPermissionKeys.every(p =>
                    permissionKeys.includes(p),
                );
                if (!isAuthorized) {
                    return res.status(HTTP_STATUS.FORBIDDEN).json({error: ERROR.INSUFFICIENT_PERMISSIONS});
                }

                // Attach to request
                req.user = user;
                req.role = role.role;

                return next();
            } catch (err) {
                log.error(err, ERROR.AUTHORIZATION_FAILED);
                return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({error: ERROR.AUTHORIZATION_FAILED});
            }
        };
    }
}

