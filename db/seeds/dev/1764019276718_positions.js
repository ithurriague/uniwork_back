//noinspection SqlNoDataSourceInspection,SqlResolve

import {faker} from '@faker-js/faker';

export default async function seed(conn) {
    const usersRes = await conn.query(
        `
            SELECT id
            FROM backend.users
            WHERE user_type = 'organization'
        `
    );
    if (usersRes.rows.length === 0) {
        throw new Error('no users found, seed users first');
    }

    const organizations = usersRes.rows;

    const categoriesRes = await conn.query(
        `SELECT id
         FROM backend.categories`
    );
    if (categoriesRes.rows.length === 0) {
        throw new Error('no categories found, seed categories first');
    }

    const categories = categoriesRes.rows;

    // Generate positions
    const positions = [];
    for (const org of organizations) {
        const count = faker.number.int({min: 1, max: 3});
        for (let i = 0; i < count; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const isRemote = faker.datatype.boolean();

            positions.push({
                users_id: org.id,
                categories_id: category.id,
                name: faker.company.catchPhrase(),
                description: faker.lorem.paragraph(),
                pay: faker.number.int({min: 0, max: 1000000}),
                location: isRemote ? null : `${faker.location.city()}, ${faker.location.country()}`,
                is_remote: isRemote
            });
        }
    }

    // Insert positions
    for (const position of positions) {
        await conn.query(
            `
                INSERT INTO backend.positions
                (users_id, categories_id, name, description, pay, location, is_remote)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT DO NOTHING
            `,
            [
                position.users_id,
                position.categories_id,
                position.name,
                position.description,
                position.pay,
                position.location,
                position.is_remote
            ]
        );
    }
}
