import { container } from 'tsyringe';

import '@modules/users/providers';

import { ITransactionsRepository } from '@modules/transactions/repositories/ITransactionsRepository';
import TransactionsRepository from '@modules/transactions/infra/typeorm/repositories/TransactionsRepository';

import { ICategoryTransactionsRepository } from '@modules/transactions/repositories/ICategoryTransactionsRepository';
import CategoriesRepository from '@modules/transactions/infra/typeorm/repositories/CategoriesRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

container.registerSingleton<ITransactionsRepository>(
  'TransactionsRepository',
  TransactionsRepository,
);

container.registerSingleton<ICategoryTransactionsRepository>(
  'CategoriesRepository',
  CategoriesRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);
