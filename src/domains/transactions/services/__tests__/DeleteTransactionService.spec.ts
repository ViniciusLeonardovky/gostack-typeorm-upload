import { AppError } from '@shared/errors/AppError';
import { FakeTransactionsRepository } from '@domains/transactions/repositories/fakes/FakeTransactionRepository';
import { FakeCategoriesRepository } from '@domains/transactions/repositories/fakes/FakeCategoriesRepository';
import { CreateTransactionService } from '@domains/transactions/services/CreateTransactionService';
import { DeleteTransactionService } from '@domains/transactions/services/DeleteTransactionService';

let fakeTransactionsRepository: FakeTransactionsRepository;
let fakeCategoriesRepository: FakeCategoriesRepository;
let createTransaction: CreateTransactionService;
let deleteTransaction: DeleteTransactionService;

describe('Delete Transaction', () => {
  beforeEach(() => {
    fakeTransactionsRepository = new FakeTransactionsRepository();
    fakeCategoriesRepository = new FakeCategoriesRepository();

    createTransaction = new CreateTransactionService(
      fakeTransactionsRepository,
      fakeCategoriesRepository,
    );

    deleteTransaction = new DeleteTransactionService(
      fakeTransactionsRepository,
    );
  });

  it('should delete a transaction', async () => {
    const transaction = await createTransaction.execute({
      title: 'Aposta',
      category: 'Others',
      type: 'income',
      value: 100,
      user_id: '123123',
    });

    await deleteTransaction.execute(transaction.id);

    const verifyIfTransactionExists = await fakeTransactionsRepository.findTransaction(
      {
        id: transaction.id,
      },
    );

    expect(verifyIfTransactionExists).toBeFalsy();
  });

  it('should not delete a transaction when is not found', async () => {
    await expect(deleteTransaction.execute('fakeId')).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
