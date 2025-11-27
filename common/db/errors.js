import {ConflictError} from '../http/errors.js';

export const ERROR = {
    MISSING_DB_CONNECTION_POOL: 'missing database connection pool',
    MISSING_CACHE_CONNECTION: 'missing cache connection',
};

export function mapConflictError(err, map) {
    if (err?.code === '23505') {
        const message = map[err.constraint];
        if (message) {
            throw new ConflictError(message);
        }
    }
    throw err;
}