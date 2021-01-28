// import { createConnection } from 'typeorm';

// createConnection();

import { createConnection, getConnectionOptions, Connection } from 'typeorm';

export default async (name = 'default'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      name,
      database:
        process.env.NODE_ENV === 'test'
          ? process.env.DB_DATABASE_TEST
          : process.env.DB_DATABASE,
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: ['./src/domains/**/infra/typeorm/entities/*.ts'],
      migrations: ['./src/shared/infra/typeorm/migrations/*.ts'],
      cli: {
        migrationsDir: './src/shared/infra/typeorm/migrations',
      },
    }),
  );
};
