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
    pgm.createTable({schema: 'backend', name: 'applications'}, {
        id: {type: 'uuid', notNull: true, default: pgm.func('gen_random_uuid()'), primaryKey: true},
        users_id: {type: 'uuid', notNull: true},
        positions_id: {type: 'uuid', notNull: true},
        status: {type: 'backend.application_status', notNull: true},
        created_at: {type: 'timestamptz', notNull: true, default: pgm.func('NOW()')},
        updated_at: {type: 'timestamptz'}
    });

    pgm.addConstraint({schema: 'backend', name: 'applications'}, 'users_fk', {
        foreignKeys: {
            columns: 'users_id',
            references: {schema: 'backend', name: 'users'},
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    });

    pgm.addConstraint({schema: 'backend', name: 'applications'}, 'positions_fk', {
        foreignKeys: {
            columns: 'positions_id',
            references: {schema: 'backend', name: 'positions'},
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    });

    pgm.addConstraint({schema: 'backend', name: 'applications'}, 'applications_uq', {
        unique: ['positions_id']
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable({schema: 'backend', name: 'applications'});
};
