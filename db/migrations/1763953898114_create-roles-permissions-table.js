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
    pgm.createTable({schema: 'backend', name: 'roles_permissions'}, {
        roles_id: {type: 'integer', notNull: true},
        permissions_id: {type: 'integer', notNull: true},
    });

    pgm.addConstraint({schema: 'backend', name: 'roles_permissions'}, 'roles_permissions_pkey', {
        primaryKey: ['roles_id', 'permissions_id']
    });

    pgm.addConstraint({schema: 'backend', name: 'roles_permissions'}, 'roles_fk', {
        foreignKeys: {
            columns: 'roles_id',
            references: {schema: 'backend', name: 'roles'},
            onDelete: 'RESTRICT',
            onUpdate: 'CASCADE'
        }
    });

    pgm.addConstraint({schema: 'backend', name: 'roles_permissions'}, 'permissions_fk', {
        foreignKeys: {
            columns: 'permissions_id',
            references: {schema: 'backend', name: 'permissions'},
            onDelete: 'RESTRICT',
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
    pgm.dropTable({schema: 'backend', name: 'roles_permissions'});
};
