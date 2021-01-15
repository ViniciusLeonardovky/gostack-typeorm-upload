import AppError from '@shared/errors/AppError';

import Transaction from '@modules/transactions/infra/typeorm/entities/Transaction';
import { ITransactionRepository } from '@modules/transactions/repositories/ITransactionRepository';
import { ICategoryTransactionsRepository } from '@modules/transactions/repositories/ICategoryTransactionsRepository';

interface IRequest {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  constructor(
    private transactionsRepository: ITransactionRepository,
    private categoriesRepository: ICategoryTransactionsRepository,
  ) {}

  public async execute({
    title,
    value,
    type,
    category,
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
    });

    return transaction;
  }
}

export default CreateTransactionService;
