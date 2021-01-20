import { AppError } from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

import { Transaction } from '@modules/transactions/infra/typeorm/entities/Transaction';
import { ITransactionsRepository } from '@modules/transactions/repositories/ITransactionsRepository';
import { ICategoryTransactionsRepository } from '@modules/transactions/repositories/ICategoryTransactionsRepository';

interface IRequest {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
  user_id: string;
}

@injectable()
export class CreateTransactionService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,

    @inject('CategoriesRepository')
    private categoriesRepository: ICategoryTransactionsRepository,
  ) {}

  public async execute({
    title,
    value,
    type,
    category,
    user_id,
  }: IRequest): Promise<Transaction> {
    const { total } = await this.transactionsRepository.getBalance();

    if (value > total && type === 'outcome') {
      throw new AppError('Limit of balance', 400);
    }

    let categoryExists = await this.categoriesRepository.findCategory(category);

    if (!categoryExists) {
      categoryExists = await this.categoriesRepository.create({
        title: category,
      });
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryExists.id,
      user_id,
    });

    return transaction;
  }
}
