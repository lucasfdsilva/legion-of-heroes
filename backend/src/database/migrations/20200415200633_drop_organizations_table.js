
exports.up = function(knex) {
  return knex.schema.dropTable('organizations');
};

exports.down = function(knex) {
  
};
