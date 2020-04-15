
exports.up = function(knex) {
  knex.schema.createTable('organizations', function(table) {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('whatsapp').notNullable();
    table.string('city').notNullable();
    table.string('eircode').notNullable();
    table.string('country').notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('organizations');
};
