
exports.up = knex => knex.schema.createTable('users', table => {
    // Primary key
    table.increments('id').primary();

    // User info
    table.string('name')
      .notNullable()
    table.string('password')
      .notNullable();
    table.dateTime('created_at')
      .defaultTo(knex.fn.now());
    table.dateTime('upated_at')
      .defaultTo(knex.fn.now());
  });
  exports.down = knex => knex.schema.dropTableIfExists('users');  