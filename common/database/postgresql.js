import {Pool} from 'pg';

const pool = new Pool({
    connectionString: process.env.POSTGRES_CONNECTION_STRING,
    ssl: process.env.ENV === 'production' ? {rejectUnauthorized: false} : false,
    connectionTimeoutMillis: 2000,
    statement_timeout: 2000,
});

pool.on('error', (err) => {
    console.error('postgreSQL pool error', err);
    process.exit(1);
});

export default pool;
