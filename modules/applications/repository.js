//noinspection SqlNoDataSourceInspection,SqlResolve

import {ERROR, mapConflictError} from '../../common/db/errors.js';
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
        const totalKey = `applications:total`;
        const result = {
            applications: [],
            total: null,
        };

        let count = this.cache.get(totalKey);
        if (!count) {
            const {rows} = await this.db.query('SELECT COUNT(*) FROM backend.applications');
            count = parseInt(rows[0].count, 10);
            this.cache.set(totalKey, count);
        }

        const query = `
            SELECT *
            FROM backend.applications
            LIMIT $1 OFFSET $2
        `;

        const {rows} = await this.db.query(query, [filter.limit, filter.offset]);
        if (rows.length <= 0) {
            throw new NotFoundError('no applications found');
        }

        result.applications = rows;
        result.total = count;

        return result;
    }


    async getByID(id) {
        const result = {
            application: {},
        };

        const query = `
            SELECT *
            FROM backend.applications
            WHERE id = $1
        `;

        const {rows} = await this.db.query(query, [id]);
        result.application = rows[0];
        if (!result.application) {
            throw new NotFoundError(`application id ${id} not found`);
        }

        return result;
    }

    async create(application = {}) {
        try {
            await this.db.query(
                `
                    INSERT INTO backend.applications (users_id, positions_id, status)
                    VALUES ($1, $2, $3)
                `
                ,
                [
                    application.usersID,
                    application.positionsID,
                    application.status,
                ]
            );
        } catch (err) {
            mapConflictError(err, {
                applications_uq: 'application already sent for this position',
            });
        }
    }

    async update(application = {}) {
        const {rowCount} = await this.db.query(
            `
                UPDATE backend.applications
                SET status     = $1,
                    updated_at = NOW()
                WHERE users_id = $2
                  AND positions_id = $3
            `
            ,
            [
                application.status,
                application.usersID,
                application.positionsID,
            ]
        );

        if (rowCount <= 0) {
            throw new NotFoundError(`application not found`);
        }
    }

    async deleteByID(id, userID) {
        const query = `
            DELETE
            FROM backend.applications
            WHERE id = $1
              AND users_id = $2
        `;

        const {rowCount} = await this.db.query(query, [id, userID]);
        if (rowCount <= 0) {
            throw new NotFoundError('no applications deleted');
        }
    }
}
