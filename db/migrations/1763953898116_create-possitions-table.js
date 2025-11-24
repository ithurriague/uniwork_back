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
    pgm.createTable({schema: 'backend', name: 'positions'}, {
        id: {type: 'uuid', notNull: true, default: pgm.func('gen_random_uuid()'), primaryKey: true},
        users_id: {type: 'uuid', notNull: true},
        categories_id: {type: 'integer', notNull: true},
        name: {type: 'text', notNull: true},
        description: {type: 'text'},
        pay: {type: 'integer'},
        location: {type: 'text'},
        is_remote: {type: 'boolean'},
        created_at: {type: 'timestamptz', notNull: true, default: pgm.func('NOW()')},
        updated_at: {type: 'timestamptz'}
    });

    pgm.addConstraint({schema: 'backend', name: 'positions'}, 'remote_check', {
        check: 'is_remote = true OR location IS NOT NULL'
    });

    pgm.addConstraint({schema: 'backend', name: 'positions'}, 'categories_fk', {
        foreignKeys: {
            columns: 'categories_id',
            references: {schema: 'backend', name: 'categories'},
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        }
    });

    pgm.addConstraint({schema: 'backend', name: 'positions'}, 'users_fk', {
        foreignKeys: {
            columns: 'users_id',
            references: {schema: 'backend', name: 'users'},
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable({schema: 'backend', name: 'positions'});
};
