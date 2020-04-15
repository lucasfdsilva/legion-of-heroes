
exports.up = function(knex) {
  knex.schema.createTable('incidents', function(table) {
    table.increments();

    table.string('title').notNullable();
    table.string('description').notNullable();
    table.decimal('value').notNullable();

    table.string('organization_id').notNullable();
    
    table.foreign('organization_id').references('id').inTable('ongs');
  }).then()
};

exports.down = function(knex) {
  return knex.schema.dropTable('incidents');
};