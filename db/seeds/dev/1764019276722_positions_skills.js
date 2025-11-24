// noinspection SqlNoDataSourceInspection,SqlResolve

import {faker} from '@faker-js/faker';

export default async function seed(conn) {
    const positionsRes = await conn.query(`SELECT id
                                           FROM backend.positions`);
    const positions = positionsRes.rows.map(r => r.id);
    if (positions.length === 0) {
        throw new Error('no positions found, seed positions first');
    }

    const skillsRes = await conn.query(`SELECT id
                                        FROM backend.skills`);
    const skills = skillsRes.rows.map(r => r.id);
    if (skills.length === 0) {
        throw new Error('no skills found, seed skills first');
    }

    // Generate positions_skills
    const positionsSkills = [];
    for (const positionID of positions) {
        // 3–5 random skills
        const skillCount = faker.number.int({min: 3, max: 5});
        const shuffledSkills = faker.helpers.shuffle(skills).slice(0, skillCount);

        for (const skillID of shuffledSkills) {
            positionsSkills.push({
                positions_id: positionID,
                skills_id: skillID,
                expertise: faker.number.int({min: 1, max: 10}),
                is_required: faker.datatype.boolean()
            });
        }
    }

    // Insert
    for (const ps of positionsSkills) {
        await conn.query(
            `
                INSERT INTO backend.positions_skills
                    (positions_id, skills_id, expertise, is_required)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (positions_id, skills_id) DO NOTHING
            `,
            [ps.positions_id, ps.skills_id, ps.expertise, ps.is_required]
        );
    }
}
