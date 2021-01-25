import { AppError } from '@shared/errors/AppError';
import { FakeTransactionsRepository } from '@domains/transactions/repositories/fakes/FakeTransactionRepository';
import { FakeCategoriesRepository } from '@domains/transactions/repositories/fakes/FakeCategoriesRepository';
import { CreateTransactionService } from '@domains/transactions/services/CreateTransactionService';

let fakeTransactionsRepository: FakeTransactionsRepository;
let fakeCategoriesRepository: FakeCategoriesRepository;
let createTransaction: CreateTransactionService;

describe('Create Transaction', () => {
  beforeEach(() => {
    fakeTransactionsRepository = new FakeTransactionsRepository();
    fakeCategoriesRepository = new FakeCategoriesRepository();

    createTransaction = new CreateTransactionService(
      fakeTransactionsRepository,
      fakeCategoriesRepository,
    );
  });

  it('should create a new transaction', async () => {
    const transaction = await createTransaction.execute({
      title: 'Aposta',
      category: 'Others',
      type: 'income',
      value: 100,
      user_id: '123123',
    });

    expect(transaction).toHaveProperty('id');
    expect(transaction.user_id).toBe('123123');
  });

  it('should not create a new transaction when value be greather than total', async () => {
    await expect(
      createTransaction.execute({
        title: 'Pizza',
        category: 'Foods',
        type: 'outcome',
        value: 120,
        user_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
