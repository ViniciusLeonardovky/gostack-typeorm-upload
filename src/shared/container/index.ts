import { container } from 'tsyringe';

import '@domains/users/providers';

import { ITransactionsRepository } from '@domains/transactions/repositories/ITransactionsRepository';
import { TransactionsRepository } from '@domains/transactions/infra/typeorm/repositories/TransactionsRepository';

import { ICategoryTransactionsRepository } from '@domains/transactions/repositories/ICategoryTransactionsRepository';
import { CategoriesRepository } from '@domains/transactions/infra/typeorm/repositories/CategoriesRepository';

import { IUsersRepository } from '@domains/users/repositories/IUsersRepository';
import { UsersRepository } from '@domains/users/infra/typeorm/repositories/UsersRepository';

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
