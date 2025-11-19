import {ERROR} from '../../common/db/errors.js';

/**
 * Repository for database health monitoring.
 *
 * This class provides methods to check the connection status
 * and resource usage of a PostgreSQL connection pool.
 *
 * @param {import('pg').Pool} db - A configured PostgreSQL connection pool.
 */
export default class Repository {
    constructor(db) {
        if (!db) {throw new Error(ERROR.MISSING_DB_CONNECTION_POOL);}
        this.db = db;
    }

    async health() {
        const result = {
            connected: false,
            latency: null,
            pool: {
                total: null,
                idle: null,
                waiting: null,
            },
            error: null,
        };

        try {
            const start = performance.now();
            await this.db.query('SELECT 1');

            result.connected = true;
            result.latency = Math.round(performance.now() - start);
            result.pool.total = this.db.totalCount;
            result.pool.idle = this.db.idleCount;
            result.pool.waiting = this.db.waitingCount;
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