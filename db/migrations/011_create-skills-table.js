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
    pgm.createTable({schema: 'backend', name: 'skills'}, {
        id: {type: 'serial', primaryKey: true},
        entity_id: {type: 'uuid', notNull: true},
        entity_type: {type: 'text', notNull: true},
        name: {type: 'text', notNull: true},
        expertise: {type: 'smallint', notNull: true}
    });

    pgm.addConstraint({schema: 'backend', name: 'skills'}, 'expertise_range_1_10', {
        check: 'expertise BETWEEN 1 AND 10'
    });

    pgm.addConstraint({schema: 'backend', name: 'skills'}, 'entity_type_user_position', {
        check: "entity_type IN ('user', 'position')"
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable({schema: 'backend', name: 'skills'});
};
