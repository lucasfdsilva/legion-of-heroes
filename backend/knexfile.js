const AWSSecretsManager = require("../backend/AWSSecretsManager");

// Update with your config settings.
module.exports = {
  async getConfiguration() {
    const credentials = await AWSSecretsManager.getCredentials('legion-of-heroes-db-credentials');

    return {
      development: {
        client: "mysql",
        connection: {
          host: credentials.host,
          database: credentials.dbname,
          user: credentials.username,
          password: credentials.password,
        },
        pool: {
          min: 0,
          max: 10,
        },
        migrations: {
          directory: "./src/database/migrations",
        },
        useNullAsDefault: true,
      },

      staging: {
        client: "mysql",
        connection: {
          database: "my_db",
          user: "username",
          password: "password",
        },
        pool: {
          min: 2,
          max: 10,
        },
        migrations: {
          tableName: "knex_migrations",
        },
      },

      production: {
        client: "mysql",
        connection: {
          host: credentials.host,
          database: credentials.dbname,
          user: credentials.username,
          password: credentials.password,
        },
        pool: {
          min: 0,
          max: 10,
        },
        migrations: {
          directory: "./src/database/migrations",
        },
        useNullAsDefault: true,
      },
    };
  },
};
