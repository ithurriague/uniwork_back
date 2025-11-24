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
    pgm.createTable({schema: 'backend', name: 'users'}, {
        id: {type: 'uuid', notNull: true, default: pgm.func('gen_random_uuid()'), primaryKey: true},
        roles_id: {type: 'integer'},
        user_type: {type: 'text', notNull: true},
        uid: {type: 'text', notNull: true, unique: true},
        email: {type: 'text', notNull: true, unique: true},
        name: {type: 'text'},
        phone: {type: 'text'},
        picture_url: {type: 'text'},
        university: {type: 'text'},
        degree: {type: 'text'},
        created_at: {type: 'timestamptz', default: pgm.func('NOW()')}
    });

    pgm.addConstraint({schema: 'backend', name: 'users'}, 'user_type_student_organization', {
        check: "user_type IN ('user', 'organization')"
    });

    pgm.addConstraint({schema: 'backend', name: 'users'}, 'roles_fk', {
        foreignKeys: {
            columns: 'roles_id',
            references: {schema: 'backend', name: 'roles'},
            onDelete: 'SET NULL',
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
    pgm.dropTable({schema: 'backend', name: 'users'});
};
