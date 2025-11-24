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
    pgm.createTable({schema: 'backend', name: 'ratings'}, {
        id: {type: 'uuid', notNull: true, default: pgm.func('gen_random_uuid()'), primaryKey: true},
        rater_id: {type: 'uuid', notNull: true},
        ratee_id: {type: 'uuid', notNull: true},
        rater_type: {type: 'text', notNull: true},
        ratee_type: {type: 'text', notNull: true},
        applications_id: {type: 'uuid'},
        stars: {type: 'decimal(2,1)', notNull: true},
        review: {type: 'text'},
        created_at: {type: 'timestamptz', notNull: true, default: pgm.func('NOW()')},
        deleted_at: {type: 'timestamptz'}
    });

    pgm.addConstraint({schema: 'backend', name: 'ratings'}, 'stars_range_step_0_5', {
        check: 'stars >= 0 AND stars <= 5 AND stars * 2 = floor(stars * 2)'
    });

    pgm.addConstraint({ schema: 'backend', name: 'ratings' }, 'rater_type_check', {
        check: "rater_type IN ('student', 'organization')",
    });

    pgm.addConstraint({ schema: 'backend', name: 'ratings' }, 'ratee_type_check', {
        check: "ratee_type IN ('student', 'organization')",
    });

    // Valid direction
    pgm.addConstraint({ schema: 'backend', name: 'ratings' }, 'direction_check', {
        check: `
            (rater_type = 'student' AND ratee_type = 'organization')
            OR
            (rater_type = 'organization' AND ratee_type = 'student')
        `,
    });

    pgm.addConstraint({schema: 'backend', name: 'ratings'}, 'rater_fk', {
        foreignKeys: {
            columns: 'rater_id',
            references: {schema: 'backend', name: 'users'},
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        }
    });

    pgm.addConstraint({schema: 'backend', name: 'ratings'}, 'ratee_fk', {
        foreignKeys: {
            columns: 'ratee_id',
            references: {schema: 'backend', name: 'users'},
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        }
    });

    pgm.addConstraint({schema: 'backend', name: 'ratings'}, 'applications_fk', {
        foreignKeys: {
            columns: 'applications_id',
            references: {schema: 'backend', name: 'applications'},
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        }
    });

    // Indexes
    pgm.createIndex({ schema: 'backend', name: 'ratings' }, ['rater_id']);
    pgm.createIndex({ schema: 'backend', name: 'ratings' }, ['ratee_id']);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable({schema: 'backend', name: 'ratings'});
};
