import {PERMISSIONS} from '../../../common/auth/permissions.js';

export default async function seed(conn) {
    const permissions = Object.entries(PERMISSIONS);

    for (const [label, key] of permissions) {
        // noinspection SqlNoDataSourceInspection,SqlResolve
        await conn.query(
            `
                INSERT INTO backend.permissions (key, label)
                VALUES ($1, $2)
                ON CONFLICT (key) DO NOTHING
            `,
            [key, label],
        );
    }
}
