import {ROLES} from '../../../common/auth/roles.js';

export default async function seed(conn) {
    const roles = Object.entries(ROLES);

    for (const [label, key] of roles) {
        // noinspection SqlNoDataSourceInspection,SqlResolve
        await conn.query(
            `
                INSERT INTO backend.roles (key, label)
                VALUES ($1, $2)
                ON CONFLICT (key) DO NOTHING
            `,
            [key, label],
        );
    }
}
