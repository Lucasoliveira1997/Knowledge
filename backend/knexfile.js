// Update with your config settings.

const { postgresDb } = require('./.env')

module.exports = {
  client: postgresDb.client,
  connection: {
    database: postgresDb.database,
    user: postgresDb.user,
    password: postgresDb.password
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
}
