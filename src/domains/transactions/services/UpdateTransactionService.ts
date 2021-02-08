import { AppError } from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

import { Transaction } from '@domains/transactions/infra/typeorm/entities/Transaction';
import { ITransactionsRepository } from '@domains/transactions/repositories/ITransactionsRepository';

interface IRequest {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  transaction_id: string;
}

@injectable()
export class UpdateTransactionService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,
  ) {}

  public async execute({
    title,
    value,
    type,
    transaction_id,
  }: IRequest): Promise<Transaction> {
    const transaction = await this.transactionsRepository.updateTransaction({
      title,
      value,
      type,
      transaction_id,
    });

    if (!transaction) {
      throw new AppError('Transaction not found');
    }

    return transaction;
  }
}
