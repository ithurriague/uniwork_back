//noinspection SqlNoDataSourceInspection,SqlResolve

import {ERROR} from '../../common/db/errors.js';
import {NotFoundError} from '../../common/http/errors.js';

export default class Repository {
    constructor(db) {
        if (!db) {
            throw new Error(ERROR.MISSING_DB_CONNECTION_POOL);
        }
        this.db = db;
    }

    /**
     * Get roles by id
     * joined with its permissions
     *
     * @param {string} id
     */
    async getByID(id) {
        const result = {
            role: {},
            permissions: [],
        };

        const rolesQuery = `
            SELECT *
            FROM backend.roles
            WHERE id = $1
        `;

        const {rows: roleRows} = await this.db.query(rolesQuery, [id]);
        if (roleRows.length <= 0) {
            throw new NotFoundError(`role id ${id} not found`);
        }
        result.role = roleRows[0];

        const permissionsQuery = `
            SELECT p.id, p.key
            FROM backend.roles_permissions rp
                     INNER JOIN backend.permissions p
                                ON p.id = rp.permissions_id
            WHERE rp.roles_id = $1
        `;
        const {rows: permissionRows} = await this.db.query(permissionsQuery, [id]);
        result.permissions = permissionRows;

        return result;
    }

    async getAll() {
        const result = {
            roles: [],
        };

        const rolesQuery = `
            SELECT *
            FROM backend.roles
        `;

        const {rows} = await this.db.query(rolesQuery);
        result.roles = rows;

        return result;
    }
}
