import { FakeTransactionsRepository } from '@domains/transactions/repositories/fakes/FakeTransactionRepository';
import { FakeCategoriesRepository } from '@domains/transactions/repositories/fakes/FakeCategoriesRepository';
import { CreateTransactionService } from '@domains/transactions/services/CreateTransactionService';
import { ListTransactionsService } from '@domains/transactions/services/ListTransactionsService';

let fakeTransactionsRepository: FakeTransactionsRepository;
let fakeCategoriesRepository: FakeCategoriesRepository;
let createTransaction: CreateTransactionService;
let listTransactions: ListTransactionsService;

describe('List Transaction', () => {
  beforeEach(() => {
    fakeTransactionsRepository = new FakeTransactionsRepository();
    fakeCategoriesRepository = new FakeCategoriesRepository();

    createTransaction = new CreateTransactionService(
      fakeTransactionsRepository,
      fakeCategoriesRepository,
    );

    listTransactions = new ListTransactionsService(fakeTransactionsRepository);
  });

  it('should list user transactions', async () => {
    await createTransaction.execute({
      title: 'Aposta 1',
      category: 'Others',
      type: 'income',
      value: 100,
      user_id: '123123',
    });

    await createTransaction.execute({
      title: 'Aposta 2',
      category: 'Others',
      type: 'income',
      value: 100,
      user_id: '123123',
    });

    await createTransaction.execute({
      title: 'Aposta 3',
      category: 'Others',
      type: 'income',
      value: 100,
      user_id: '123123',
    });

    await createTransaction.execute({
      title: 'Aposta 4',
      category: 'Others',
      type: 'income',
      value: 100,
      user_id: '123123',
    });

    await createTransaction.execute({
      title: 'Aposta 5',
      category: 'Others',
      type: 'income',
      value: 100,
      user_id: '123123',
    });

    await createTransaction.execute({
      title: 'Aposta 6',
      category: 'Others',
      type: 'income',
      value: 100,
      user_id: '123123',
    });

    await createTransaction.execute({
      title: 'Aposta 7',
      category: 'Others',
      type: 'income',
      value: 100,
      user_id: '123123',
    });

    await createTransaction.execute({
      title: 'Aposta 8',
      category: 'Others',
      type: 'income',
      value: 100,
      user_id: '123123',
    });

    await createTransaction.execute({
      title: 'Aposta 9',
      category: 'Others',
      type: 'income',
      value: 100,
      user_id: '123123',
    });

    await createTransaction.execute({
      title: 'Pizza',
      category: 'Foods',
      type: 'outcome',
      value: 20,
      user_id: '123123',
    });

    await createTransaction.execute({
      title: 'Boleto',
      category: 'Others',
      type: 'outcome',
      value: 30,
      user_id: '123123',
    });

    const transactions = await listTransactions.execute({
      user_id: '123123',
      page: 1,
      limitPerPage: 9,
    });

    expect(transactions.transactions).toHaveLength(9);
    expect(transactions.totalTransactions).toBe(11);
    expect(transactions.balance.total).toBe(850);
  });
});
