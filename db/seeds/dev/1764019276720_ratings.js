/* eslint-disable no-magic-numbers */
//noinspection SqlNoDataSourceInspection,SqlResolve

import {faker} from '@faker-js/faker';

export default async function seed(conn) {
    const res = await conn.query(
        `SELECT id, user_type
         FROM backend.users`
    );
    if (!res.rows.length) {
        throw new Error('No users found, seed users first');
    }

    const students = res.rows.filter(u => u.user_type === 'student');
    const organizations = res.rows.filter(u => u.user_type === 'organization');
    if (!students.length || !organizations.length) {
        throw new Error('Need both students and organizations to create ratings');
    }

    const resApps = await conn.query(
        `SELECT id
         FROM backend.applications`
    );
    const applications = resApps.rows.map(r => r.id);
    if (!applications.length) {
        throw new Error('no applications found, seed applications first');
    }

    const ratings = [];
    // Generate ratings student -> organization
    for (const student of students) {
        const org = organizations[Math.floor(Math.random() * organizations.length)];
        const applications_id = Math.random() < 0.5
            ? applications[Math.floor(Math.random() * applications.length)]
            : null;

        ratings.push({
            rater_id: student.id,
            rater_type: 'student',
            ratee_id: org.id,
            ratee_type: 'organization',
            applications_id,
            stars: Math.floor(Math.random() * 11) / 2,
            review: faker.lorem.sentences(Math.floor(Math.random() * 3) + 1),
        });
    }

    // Generate ratings organization -> student
    for (const org of organizations) {
        const student = students[Math.floor(Math.random() * students.length)];
        const applications_id = Math.random() < 0.5
            ? applications[Math.floor(Math.random() * applications.length)]
            : null;

        ratings.push({
            rater_id: org.id,
            rater_type: 'organization',
            ratee_id: student.id,
            ratee_type: 'student',
            applications_id,
            stars: Math.floor(Math.random() * 11) / 2,
            review: faker.lorem.sentences(Math.floor(Math.random() * 3) + 1),
        });
    }

    // Insert
    for (const r of ratings) {
        await conn.query(
            `
                INSERT INTO backend.ratings
                (rater_id, rater_type, ratee_id, ratee_type, applications_id, stars, review, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
                ON CONFLICT DO NOTHING
            `,
            [
                r.rater_id,
                r.rater_type,
                r.ratee_id,
                r.ratee_type,
                r.applications_id,
                r.stars,
                r.review
            ]
        );
    }
}
