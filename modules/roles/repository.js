//noinspection SqlNoDataSourceInspection,SqlResolve

import {ERROR} from '../../common/db/errors.js';

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
            error: null,
        };

        try {
            const rolesQuery = `
                SELECT *
                FROM backend.roles
                WHERE id = $1
            `;

            const {rows: roleRows} = await this.db.query(rolesQuery, [id]);
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
        } catch (err) {
            result.error =
                err?.message ||
                err?.code ||
                JSON.stringify(err) ||
                'Unknown error';
        }

        return result;
    }

    async getAll() {
        const result = {
            roles: [],
            error: null,
        };

        try {
            const rolesQuery = `
                SELECT *
                FROM backend.roles
            `;

            const {rows} = await this.db.query(rolesQuery);
            result.roles = rows;
        } catch (err) {
            result.error =
                err?.message ||
                err?.code ||
                JSON.stringify(err) ||
                'Unknown error';
        }

        return result;
    }
}
