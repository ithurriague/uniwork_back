import {PERMISSIONS} from '../../../common/auth/permissions.js';
import {ROLES} from '../../../common/auth/roles.js';

export default async function seed(conn) {
    const rolePermissions = {
        [ROLES.ADMINISTRATOR]: Object.values(PERMISSIONS),

        [ROLES.ORGANIZATION]: [
            // Users
            PERMISSIONS.USERS_READ,
            PERMISSIONS.USERS_UPDATE,
            PERMISSIONS.USERS_DELETE,

            // Positions
            PERMISSIONS.POSITIONS_READ,
            PERMISSIONS.POSITIONS_CREATE,
            PERMISSIONS.POSITIONS_UPDATE,
            PERMISSIONS.POSITIONS_DELETE,

            // Applications
            PERMISSIONS.APPLICATIONS_READ,
            PERMISSIONS.APPLICATIONS_UPDATE,

            // Ratings
            PERMISSIONS.RATINGS_READ,
            PERMISSIONS.RATINGS_CREATE,
            PERMISSIONS.RATINGS_UPDATE,
            PERMISSIONS.RATINGS_DELETE,

            // Users-Skills
            PERMISSIONS.USERS_SKILLS_READ,

            // Positions-Skills
            PERMISSIONS.POSITIONS_SKILLS_READ,
            PERMISSIONS.POSITIONS_SKILLS_CREATE,
            PERMISSIONS.POSITIONS_SKILLS_UPDATE,
            PERMISSIONS.POSITIONS_SKILLS_DELETE,
        ],

        [ROLES.STUDENT]: [
            // Users
            PERMISSIONS.USERS_READ,
            PERMISSIONS.USERS_UPDATE,
            PERMISSIONS.USERS_DELETE,

            // Positions
            PERMISSIONS.POSITIONS_READ,

            // Applications
            PERMISSIONS.APPLICATIONS_READ,
            PERMISSIONS.APPLICATIONS_CREATE,
            PERMISSIONS.APPLICATIONS_UPDATE,
            PERMISSIONS.APPLICATIONS_DELETE,

            // Ratings
            PERMISSIONS.RATINGS_READ,
            PERMISSIONS.RATINGS_CREATE,
            PERMISSIONS.RATINGS_UPDATE,
            PERMISSIONS.RATINGS_DELETE,

            // Users-Skills
            PERMISSIONS.USERS_SKILLS_READ,
            PERMISSIONS.USERS_SKILLS_CREATE,
            PERMISSIONS.USERS_SKILLS_UPDATE,
            PERMISSIONS.USERS_SKILLS_DELETE,

            // Positions-Skills
            PERMISSIONS.POSITIONS_SKILLS_READ,
        ],

        [ROLES.GUEST]: [
            // Users
            PERMISSIONS.USERS_READ,
            PERMISSIONS.USERS_CREATE,

            // Positions
            PERMISSIONS.POSITIONS_READ,

            // Applications
            PERMISSIONS.APPLICATIONS_READ,

            // Ratings
            PERMISSIONS.RATINGS_READ,

            // Users-Skills
            PERMISSIONS.USERS_SKILLS_READ,

            // Positions-Skills
            PERMISSIONS.POSITIONS_SKILLS_READ,
        ],
    };

    for (const [roleKey, permissionKeys] of Object.entries(rolePermissions)) {
        // Get role ID
        // noinspection SqlNoDataSourceInspection,SqlResolve
        const roleResult = await conn.query(
            `
                SELECT id
                FROM backend.roles
                WHERE key = $1
            `,
            [roleKey],
        );

        if (roleResult.rowCount === 0) {
            throw new Error(`role not found: ${roleKey}`);
        }

        const roleId = roleResult.rows[0].id;

        for (const permissionKey of permissionKeys) {
            // Get permission ID
            // noinspection SqlNoDataSourceInspection,SqlResolve
            const permResult = await conn.query(
                `
                    SELECT id
                    FROM backend.permissions
                    WHERE key = $1
                `,
                [permissionKey],
            );

            if (permResult.rowCount === 0) {
                throw new Error(`permission not found: ${permissionKey}`);
            }

            const permissionId = permResult.rows[0].id;

            // Insert into join table (idempotent because of PK)
            // noinspection SqlNoDataSourceInspection,SqlResolve
            await conn.query(
                `
                    INSERT INTO backend.roles_permissions (roles_id, permissions_id)
                    VALUES ($1, $2)
                    ON CONFLICT DO NOTHING
                `,
                [roleId, permissionId],
            );
        }
    }
}
