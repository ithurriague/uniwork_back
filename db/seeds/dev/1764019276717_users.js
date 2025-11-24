//noinspection SqlNoDataSourceInspection,SqlResolve

import crypto from 'crypto';

import {faker} from '@faker-js/faker';

import {ROLES} from '../../../common/auth/roles.js';

const UNIVERSITIES = [
    'Harvard University',
    'MIT',
    'Stanford University',
    'University of Cambridge',
    'University of Oxford',
    'University of Buenos Aires'
];

const DEGREES = [
    'Computer Science',
    'Business',
    'Engineering',
    'Biology',
    'Mathematics',
    'Physics'
];

export default async function seed(conn) {
    const roleKeys = [ROLES.STUDENT, ROLES.ORGANIZATION];

    const res = await conn.query(
        `SELECT id, key
         FROM backend.roles
         WHERE key = ANY ($1)`,
        [roleKeys]
    );

    if (res.rows.length !== roleKeys.length) {
        throw new Error('roles (student, organization) not found, seed roles first');
    }


    // Generate
    const users = [];
    const rolesMap = Object.fromEntries(res.rows.map(row => [row.key, row.id]));
    const counts = {
        student: 5,
        organization: 5,
    };

    for (const [type, count] of Object.entries(counts)) {
        for (let i = 0; i < count; i++) {
            users.push({
                user_type: type.toLowerCase(),
                name: faker.person.fullName(),
                email: faker.internet.email(),
                phone: faker.phone.number(),
                university: type === 'student' ? UNIVERSITIES[Math.floor(Math.random() * UNIVERSITIES.length)] : null,
                degree: type === 'student' ? DEGREES[Math.floor(Math.random() * DEGREES.length)] : null,
            });
        }
    }

    // Insert
    for (const user of users) {
        const uid = crypto.randomUUID();
        const roleID = rolesMap[ROLES[user.user_type.toUpperCase()]];

        await conn.query(
            `
                INSERT INTO backend.users
                (roles_id,
                 user_type,
                 uid, email,
                 name,
                 phone,
                 picture_url,
                 university,
                 degree)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                ON CONFLICT (uid) DO NOTHING
            `,
            [
                roleID,
                user.user_type,
                uid,
                user.email,
                user.name,
                user.phone,
                null,
                user.university,
                user.degree
            ]
        );
    }
}
