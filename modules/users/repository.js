//noinspection SqlNoDataSourceInspection,SqlResolve

import {ERROR} from '../../common/db/errors.js';
import {NotFoundError} from '../../common/http/errors.js';

export default class Repository {
    constructor(
        db,
        cache,
    ) {
        if (!db) {
            throw new Error(ERROR.MISSING_DB_CONNECTION_POOL);
        }
        this.db = db;

        if (!cache) {
            throw new Error(ERROR.MISSING_CACHE_CONNECTION);
        }
        this.cache = cache;
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
        const totalKey = `users:user_type${filter.user_type}:total`;
        const result = {
            users: [],
            total: null,
        };

        const conditions = [];
        const values = [];
        let count = this.cache.get(totalKey);

        // Append conditions
        if (filter.user_type) {
            values.push(filter.user_type);
            conditions.push(`user_type = $${values.length}`);
        }

        if (!count) {
            let query = `
                SELECT COUNT(*)
                FROM backend.users
            `;

            // Concatenate conditions to query
            if (conditions.length > 0) {
                query += ` WHERE ${conditions.join(' AND ')}`;
            }

            const {rows} = await this.db.query(query, values);
            count = parseInt(rows[0].count, 10);
            this.cache.set(totalKey, count);
        }

        let query = `
            SELECT *
            FROM backend.users
        `;

        // Concatenate conditions to query
        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        // Paginate
        // eslint-disable-next-line no-magic-numbers
        query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
        values.push(filter.limit, filter.offset);

        const {rows} = await this.db.query(query, values);
        if (rows.length <= 0) {
            throw new NotFoundError('no users found');
        }

        result.users = rows;
        result.total = count;

        return result;
    }


    async getByID(id) {
        const result = {
            user: {},
        };

        const query = `
            SELECT *
            FROM backend.users
            WHERE id = $1
        `;

        const {rows} = await this.db.query(query, [id]);
        if (rows.length <= 0) {
            throw new NotFoundError(`user id ${id} not found`);
        }

        result.user = rows[0];

        return result;
    }

    async getByUID(uid) {
        const result = {
            user: {},
        };

        const query = `
            SELECT *
            FROM backend.users
            WHERE uid = $1
        `;

        const {rows} = await this.db.query(query, [uid]);
        if (rows.length <= 0) {
            throw new NotFoundError(`user uid ${uid} not found`);
        }

        result.user = rows[0];

        return result;
    }

    async create(user = {}) {
        return await this.db.query(
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
    }
}
