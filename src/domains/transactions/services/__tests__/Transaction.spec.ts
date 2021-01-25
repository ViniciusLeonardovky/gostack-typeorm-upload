import request from 'supertest';
import path from 'path';
import { Connection, getRepository, getConnection } from 'typeorm';
import createConnection from '@shared/infra/typeorm/index';

import { Transaction } from '@domains/transactions/infra/typeorm/entities/Transaction';
import { Category } from '@domains/transactions/infra/typeorm/entities/Category';

import { app } from '@shared/infra/http/app';

let connection: Connection;

describe('Transaction', () => {
  beforeAll(async () => {
    connection = await createConnection('test-connection');

    await connection.query('DROP TABLE IF EXISTS migrations');
    await connection.query('DROP TABLE IF EXISTS transactions');
    await connection.query('DROP TABLE IF EXISTS categories');
    await connection.query('DROP TABLE IF EXISTS users');

    await connection.runMigrations();
  });

  beforeEach(async () => {
    await connection.query('DELETE FROM transactions');
    await connection.query('DELETE FROM categories');
    await connection.query('DELETE FROM users');
  });

  afterAll(async () => {
    const mainConnection = getConnection();

    await connection.close();
    await mainConnection.close();
  });

  it('should be able to import transactions', async () => {
    const transactionsRepository = getRepository(Transaction);
    const categoriesRepository = getRepository(Category);

    const importCSV = path.resolve(__dirname, 'import_template.csv');

    await request(app).post('/users').send({
      name: 'Nome maneiro',
      email: 'teste@teste.com',
      password: '123456',
    });

    const authUser = await request(app).post('/sessions').send({
      email: 'teste@teste.com',
      password: '123456',
    });

    await request(app)
      .post('/transactions/import')
      .attach('file', importCSV)
      .set('Authorization', `bearer ${authUser.body.token}`);

    const transactions = await transactionsRepository.find();
    const categories = await categoriesRepository.find();

    expect(categories).toHaveLength(2);
    expect(categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Others',
        }),
        expect.objectContaining({
          title: 'Food',
        }),
      ]),
    );

    expect(transactions).toHaveLength(3);
    expect(transactions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Loan',
          type: 'income',
        }),
        expect.objectContaining({
          title: 'Website Hosting',
          type: 'outcome',
        }),
        expect.objectContaining({
          title: 'Ice cream',
          type: 'outcome',
        }),
      ]),
    );
  });

  it('should not create categories that already exists', async () => {
    const categoriesRepository = getRepository(Category);

    const importCSV = path.resolve(__dirname, 'import_template2.csv');
    const importCSV2 = path.resolve(__dirname, 'import_template2.csv');

    await request(app).post('/users').send({
      name: 'Nome maneiro',
      email: 'teste@teste.com',
      password: '123456',
    });

    const authUser = await request(app).post('/sessions').send({
      email: 'teste@teste.com',
      password: '123456',
    });

    await request(app)
      .post('/transactions/import')
      .attach('file', importCSV)
      .set('Authorization', `bearer ${authUser.body.token}`);
    await request(app)
      .post('/transactions/import')
      .attach('file', importCSV2)
      .set('Authorization', `bearer ${authUser.body.token}`);

    const categories = await categoriesRepository.find();

    expect(categories).toHaveLength(2);
  });
});
