import { FakeCategoriesRepository } from '@domains/transactions/repositories/fakes/FakeCategoriesRepository';
import { FakeTransactionsRepository } from '@domains/transactions/repositories/fakes/FakeTransactionRepository';
import { CreateTransactionService } from '@domains/transactions/services/CreateTransactionService';
import { UpdateTransactionService } from '@domains/transactions/services/UpdateTransactionService';

let fakeTransactionsRepository: FakeTransactionsRepository;
let fakeCategoriesRepository: FakeCategoriesRepository;
let updateTransaction: UpdateTransactionService;
let createTransaction: CreateTransactionService;

describe('Update Transaction', () => {
  beforeEach(() => {
    fakeTransactionsRepository = new FakeTransactionsRepository();
    fakeCategoriesRepository = new FakeCategoriesRepository();

    createTransaction = new CreateTransactionService(
      fakeTransactionsRepository,
      fakeCategoriesRepository,
    );

    updateTransaction = new UpdateTransactionService(
      fakeTransactionsRepository,
    );
  });

  it('should update a transaction', async () => {
    const transaction = await createTransaction.execute({
      title: 'Aposta',
      category: 'Others',
      type: 'income',
      value: 100,
      user_id: '123123',
    });

    const transactionUpdated = await updateTransaction.execute({
      title: 'atualizado',
      type: 'outcome',
      value: 22,
      transaction_id: transaction.id,
    });

    expect(transactionUpdated.title).toBe('atualizado');
    expect(transactionUpdated.type).toBe('outcome');
    expect(transactionUpdated.value).toBe(22);
  });
});
