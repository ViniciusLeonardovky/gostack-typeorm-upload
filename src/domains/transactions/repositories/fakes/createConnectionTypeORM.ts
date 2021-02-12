import { createConnection, getConnectionOptions, Connection } from 'typeorm';

export default async (name = 'default'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      name,
      entities: ['./src/domains/**/infra/typeorm/entities/*.ts'],
      migrations: ['./src/shared/infra/typeorm/migrations/*.ts'],
      cli: {
        migrationsDir: './src/shared/infra/typeorm/migrations',
      },
      database: process.env.DB_DATABASE_TEST,
    }),
  );
};
