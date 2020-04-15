
exports.up = function(knex) {
  knex.schema.dropTable('organizations');
  knex.schema.dropTable('incidents');
};

exports.down = function(knex) {
  
};
