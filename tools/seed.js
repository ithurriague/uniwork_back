import fs from 'fs/promises';
import path from 'path';
import {fileURLToPath, pathToFileURL} from 'url';

import getPool from '../common/db/postgresql.js';
import log from '../common/log/pino.js';

const fileName = fileURLToPath(import.meta.url);
const fileDirectory = path.dirname(fileName);
const seedDirectoryParamIndex = 2;

async function run() {
    const seedDirectoryName = process.argv[seedDirectoryParamIndex];
    if (!seedDirectoryName) {
        throw new Error('missing seed directory name argument');
    }

    let seedDirectory;
    try {
        seedDirectory = path.join(
            fileDirectory,
            `../db/seeds/${seedDirectoryName}`,
        );
        await fs.access(seedDirectory);
    } catch (err) {
        throw new Error(
            `seed directory ${seedDirectory} not found`,
            {cause: err},
        );
    }

    let seedFiles;
    try {
        seedFiles = (await fs.readdir(seedDirectory, {withFileTypes: true}))
            .filter(d => d.isFile() && (d.name.endsWith('.js') || d.name.endsWith('.mjs')))
            .map(d => d.name)
            .sort();
    } catch (err) {
        throw new Error(
            `error reading ${seedDirectory} seed directory`,
            {cause: err},
        );
    }

    if (seedFiles.length === 0) {
        log.info('empty seed directory');
        return;
    }

    let conn;
    try {
        const pool = getPool();
        conn = await pool.connect();
    } catch (err) {
        throw new Error(
            'failed to establish db connection',
            {cause: err},
        );
    }

    try {
        await transaction(conn, seedDirectory, seedFiles);
    } finally {
        conn.release();
    }
}

async function transaction(conn, directory, files) {
    try {
        await conn.query('BEGIN');

        for (const file of files) {
            await seed(conn, directory, file);
        }

        await conn.query('COMMIT');
        log.info('\n✅ Seeding complete.');
    } catch (err) {
        await conn.query('ROLLBACK');
        throw new Error(
            '\n❌ Seeding failed, rolling back',
            {cause: err},
        );
    }
}

async function seed(conn, directory, file) {
    log.info(`→ running ${file}`);
    try {
        const filePath = path.join(directory, file);
        const fileUrl = pathToFileURL(filePath).toString();

        const {default: seed} = await import(fileUrl);
        if (typeof seed !== 'function') {
            throw new Error(`seed file ${file} does not export a default function`);
        }

        await seed(conn);
        log.info(`  ✅ ${file} completed`);
    } catch (err) {
        throw new Error(
            `  ❌ ${file} failed`,
            {cause: err},
        );
    }
}

run().catch(err => {
    log.error(err);
    process.exit(1);
});