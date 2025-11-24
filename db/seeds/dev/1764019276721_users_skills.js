// noinspection SqlNoDataSourceInspection,SqlResolve

import {faker} from '@faker-js/faker';

export default async function seed(conn) {
    const usersRes = await conn.query(`SELECT id FROM backend.users`);
    const users = usersRes.rows.map(r => r.id);
    if (users.length === 0) {
        throw new Error('no users found, seed users first');
    }

    const skillsRes = await conn.query(`SELECT id FROM backend.skills`);
    const skills = skillsRes.rows.map(r => r.id);
    if (skills.length === 0) {
        throw new Error('no skills found, seed skills first');
    }

    // Generate users_skills
    const userSkills = [];
    for (const userID of users) {
        //  3–5 random skills
        const skillCount = faker.number.int({min: 3, max: 5});
        const shuffledSkills = faker.helpers.shuffle(skills).slice(0, skillCount);

        for (const skillID of shuffledSkills) {
            userSkills.push({
                users_id: userID,
                skills_id: skillID,
                expertise: faker.number.int({min: 1, max: 10})
            });
        }
    }

    // Insert
    for (const us of userSkills) {
        await conn.query(
            `
                INSERT INTO backend.users_skills
                (users_id, skills_id, expertise)
                VALUES ($1, $2, $3)
                ON CONFLICT (users_id, skills_id) DO NOTHING
            `,
            [us.users_id, us.skills_id, us.expertise]
        );
    }
}
