import AppError from '@shared/errors/AppError';

import { ITransactionRepository } from '@modules/transactions/repositories/ITransactionRepository';

class DeleteTransactionService {
  constructor(private transactionsRepository: ITransactionRepository) {}

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

export default DeleteTransactionService;
