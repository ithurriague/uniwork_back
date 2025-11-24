//noinspection SqlNoDataSourceInspection,SqlResolve

import {faker} from '@faker-js/faker';

export default async function seed(conn) {
    const usersRes = await conn.query(
        `
            SELECT id
            FROM backend.users
            WHERE user_type = 'student'
        `
    );
    if (usersRes.rows.length === 0) {
        throw new Error('no users found, seed users first');
    }

    const students = usersRes.rows;

    const positionsRes = await conn.query(
        `SELECT id
         FROM backend.positions`
    );
    if (positionsRes.rows.length === 0) {
        throw new Error('no positions found, seed categories first');
    }

    const positions = positionsRes.rows;

    // Generate applications
    const applications = [];
    const statuses = ['accepted', 'rejected', 'pending', 'expired'];
    for (const student of students) {
        const count = faker.number.int({min: 1, max: 3});
        for (let i = 0; i < count; i++) {
            const position = positions[Math.floor(Math.random() * positions.length)];

            applications.push({
                users_id: student.id,
                positions_id: position.id,
                status: statuses[Math.floor(Math.random() * statuses.length)],
            });
        }
    }

    // Insert applications
    for (const application of applications) {
        await conn.query(
            `
                INSERT INTO backend.applications
                    (users_id, positions_id, status)
                VALUES ($1, $2, $3)
                ON CONFLICT DO NOTHING
            `,
            [
                application.users_id,
                application.positions_id,
                application.status,
            ]
        );
    }
}
