//noinspection SqlNoDataSourceInspection,SqlResolve

import {ERROR} from '../../common/db/errors.js';
import {NotFoundError} from '../../common/http/errors.js';

export default class Repository {
    constructor(
        db,
    ) {
        if (!db) {
            throw new Error(ERROR.MISSING_DB_CONNECTION_POOL);
        }
        this.db = db;
    }

    async getByID(id) {
        const result = {
            category: {},
        };

        const query = `
            SELECT *
            FROM backend.categories
            WHERE id = $1
        `;

        const {rows} = await this.db.query(query, [id]);
        result.category = rows[0];
        if (!result.category) {
            throw new NotFoundError(`category with id ${id} not found`);
        }

        return result;
    }

    async getAll() {
        const result = {
            categories: [],
        };

        const query = `
            SELECT *
            FROM backend.categories
        `;

        const {rows} = await this.db.query(query);
        if (rows.length <= 0) {
            throw new NotFoundError('no categories found');
        }

        result.categories = rows;

        return result;
    }
}
