import { AppError } from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';

import { ITransactionsRepository } from '@modules/transactions/repositories/ITransactionsRepository';

@injectable()
export class DeleteTransactionService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const transactionExists = await this.transactionsRepository.findTransaction(
      { id },
    );

    if (!transactionExists) {
      throw new AppError('transaction not found', 400);
    }

    await this.transactionsRepository.deleteTransaction({ id });
  }
}
