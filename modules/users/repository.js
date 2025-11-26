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
     * @typedef {Object} UserFilter
     * @property {string=} user_type
     */

    /**
     * @typedef {Object} GetAllUsersResult
     * @property {Array} users
     * @property {string|null} error
     */

    /**
     * Get users with optional filters.
     *
     * @param {UserFilter} filter
     * @returns {Promise<GetAllUsersResult>}
     */
    async getAll(filter = {}) {
        const result = {
            users: [],
            error: null,
        };

        try {
            const conditions = [];
            const values = [];

            if (filter.user_type) {
                values.push(filter.user_type);
                conditions.push(`user_type = $${values.length}`);
            }

            let query = `
                SELECT *
                FROM backend.users
            `;

            if (conditions.length > 0) {
                query += ` WHERE ${conditions.join(' AND ')}`;
            }

            const {rows} = await this.db.query(query, values);
            result.users = rows;
        } catch (err) {
            result.error =
                err?.message ||
                err?.code ||
                JSON.stringify(err) ||
                'Unknown error';
        }

        return result;
    }


    async getByID(id, userType) {
        const result = {
            users: [],
            error: null,
        };

        try {
            const query = `
                SELECT *
                FROM backend.users
                WHERE id = $1 
                AND user_type = $2 
            `;

            const {rows} = await this.db.query(query, [id, userType]);
            result.users = rows;
        } catch (err) {
            result.error =
                err?.message ||
                err?.code ||
                JSON.stringify(err) ||
                'Unknown error';
        }

        return result;
    }

    async create(user = {}) {
        const result = {
            error: null,
        };

        try {
            await this.db.query(
                `
                    INSERT INTO backend.users (roles_id, user_type, uid, email, name, phone, picture_url, university,
                                               degree)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                `
                ,
                [
                    user.rolesID,
                    user.type,
                    user.uid,
                    user.email,
                    user.name,
                    user.phone,
                    user.pictureURL,
                    user.university,
                    user.degree,
                ]
            );
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
