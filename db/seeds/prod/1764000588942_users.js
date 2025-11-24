import crypto from 'crypto';

import {ROLES} from '../../../common/auth/roles.js';

export default async function seed(conn) {
    // noinspection SqlNoDataSourceInspection,SqlResolve
    const res = await conn.query(
        `SELECT id
         FROM backend.roles
         WHERE key = $1
         LIMIT 1`,
        [ROLES.ADMINISTRATOR]
    );

    if (res.rows.length === 0) {
        throw new Error('admin role not found, seed roles first');
    }

    const roleID = res.rows[0].id;
    // noinspection SqlNoDataSourceInspection,SqlResolve
    await conn.query(
        `
            INSERT INTO backend.users (roles_id, user_type, uid, email, name, phone, picture_url, university, degree)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (uid) DO NOTHING
        `,
        [
            roleID,
            'organization',
            crypto.randomUUID(),
            'admin@admin.com',
            'Administrator',
            null,
            null,
            null,
            null
        ]
    );
}
