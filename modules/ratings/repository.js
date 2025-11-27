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
        const totalKey = `ratings:applications_id${filter.applicationsID}:total`;
        const result = {
            ratings: [],
            total: null,
        };

        const conditions = [];
        const values = [];
        let count = this.cache.get(totalKey);

        // Append conditions
        if (filter.applicationsID) {
            values.push(filter.applicationsID);
            conditions.push(`applications_id = $${values.length}`);
        }

        if (!count) {
            let query = `
                SELECT COUNT(*)
                FROM backend.ratings
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
            FROM backend.ratings
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
            throw new NotFoundError('no ratings found');
        }

        result.ratings = rows;
        result.total = count;

        return result;
    }


    async getByID(id) {
        const result = {
            rating: {},
        };

        const query = `
            SELECT *
            FROM backend.ratings
            WHERE id = $1
        `;

        const {rows} = await this.db.query(query, [id]);
        result.rating = rows[0];
        if (!result.rating) {
            throw new NotFoundError(`rating id ${id} not found`);
        }

        return result;
    }

    async create(rating = {}) {
        return await this.db.query(
            `
                INSERT INTO backend.ratings (rater_id, ratee_id, rater_type, ratee_type, applications_id, stars,
                                             review)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `
            ,
            [
                rating.raterID,
                rating.rateeID,
                rating.raterType,
                rating.rateeType,
                rating.applicationID,
                rating.stars,
                rating.review
            ]
        );
    }
}
