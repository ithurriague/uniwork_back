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
        if (!cache) {
            throw new Error(ERROR.MISSING_CACHE_CONNECTION);
        }

        this.db = db;
        this.cache = cache;
    }

    async getAll(filter = {}) {
        const totalKey = `positions:total`;
        const result = {
            positions: [],
            total: null,
        };

        let count = this.cache.get(totalKey);
        if (!count) {
            const {rows} = await this.db.query('SELECT COUNT(*) FROM backend.positions');
            count = parseInt(rows[0].count, 10);
            this.cache.set(totalKey, count);
        }

        const query = `
            SELECT *
            FROM backend.positions
            LIMIT $1 OFFSET $2
        `;

        const {rows} = await this.db.query(query, [filter.limit, filter.offset]);
        if (rows.length <= 0) {
            throw new NotFoundError('no positions found');
        }

        result.positions = rows;
        result.total = count;

        return result;
    }


    async getByID(id) {
        const result = {
            position: {},
        };

        const query = `
            SELECT *
            FROM backend.positions
            WHERE id = $1
        `;

        const {rows} = await this.db.query(query, [id]);
        result.position = rows[0];
        if (!result.position) {
            throw new NotFoundError(`position with id ${id} not found`);
        }

        return result;
    }

    async create(position = {}) {
        return await this.db.query(
            `
                INSERT INTO backend.positions (users_id, categories_id, name, description, pay, location, is_remote)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `
            ,
            [
                position.usersID,
                position.categoriesID,
                position.name,
                position.description,
                position.pay,
                position.location,
                position.is_remote,
            ]
        );
    }

    async deleteByID(id, userID) {
        const query = `
            DELETE
            FROM backend.positions
            WHERE id = $1
              AND users_id = $2
        `;

        const {rowCount} = await this.db.query(query, [id, userID]);
        if (rowCount <= 0) {
            throw new NotFoundError('no positions deleted');
        }
    }
}
