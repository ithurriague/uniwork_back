/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable({schema: 'backend', name: 'users_skills'}, {
        users_id: {type: 'uuid', notNull: true},
        skills_id: {type: 'integer', notNull: true},
        expertise: {type: 'smallint', notNull: true}
    });

    pgm.addConstraint(
        {schema: 'backend', name: 'users_skills'},
        'pk_users_skills',
        {primaryKey: ['users_id', 'skills_id']}
    );

    pgm.addConstraint({schema: 'backend', name: 'users_skills'}, 'users_skills_expertise_range_1_10', {
        check: 'expertise BETWEEN 1 AND 10'
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable({schema: 'backend', name: 'users_skills'});
};
