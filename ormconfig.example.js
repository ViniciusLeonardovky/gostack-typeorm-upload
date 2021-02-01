module.exports = {
  "name": "default",
  "type": "postgres",
  "host": process.env.DB_HOST,
  "port": process.env.DB_PORT,
  "username": process.env.DB_USERNAME,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_DATABASE,
  "entities": process.env.NODE_ENV === 'dev' ? ["./src/domains/**/infra/typeorm/entities/*.ts"] : ["./dist/domains/**/infra/typeorm/entities/*.js"],
  "migrations": process.env.NODE_ENV === 'dev' ? ["./src/shared/infra/typeorm/migrations/*.ts"] : ["./dist/shared/infra/typeorm/migrations/*.js"],
  "cli": {
    "migrationsDir": "./src/shared/infra/typeorm/migrations"
  }
}
