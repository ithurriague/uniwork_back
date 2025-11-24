import {Pool} from 'pg';

import Config, {ENV} from '../../config/config.js';

let pool = null;
export default function getPool() {
    if (pool) {
        return pool;
    }

    try {
        pool = new Pool({
            connectionString: Config.dbURL(),
            // TODO: replace ssl config with actual cert configuration
            ssl: Config.env() === ENV.PRODUCTION ? {rejectUnauthorized: false} : false,
            connectionTimeoutMillis: 2000,
            statement_timeout: 2000,
        });
    } catch (err) {
        throw new Error(err);
    }

    pool.on('error', (err) => {
        console.error('postgreSQL pool error', err);
        process.exit(1);
    });

    return pool;
}
