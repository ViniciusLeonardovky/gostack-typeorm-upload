import { v4 } from 'uuid';
import { Transaction } from '@domains/transactions/infra/typeorm/entities/Transaction';
import {
  ITransactionsRepository,
  IGetAllTransactionsResponse,
  IBalance,
} from '@domains/transactions/repositories/ITransactionsRepository';
import { ICreateTransactionDTO } from '@domains/transactions/dtos/ICreateTransactionDTO';
import { IDeleteTransactionDTO } from '@domains/transactions/dtos/IDeleteTransactionDTO';
import { IFindTransactionDTO } from '@domains/transactions/dtos/IFindTransactionDTO';
import { IFindUserTransactionDTO } from '@domains/transactions/dtos/IFindUserTransactionDTO';
import { ICreateMultipleTransactionsDTO } from '@domains/transactions/dtos/ICreateMultipleTransactionsDTO';
import { IUpdateTransactionDTO } from '@domains/transactions/dtos/IUpdateTransactionDTO';

export class FakeTransactionsRepository implements ITransactionsRepository {
  private transactions: Transaction[] = [];

  public async getBalance({
    user_id,
  }: IFindUserTransactionDTO): Promise<IBalance> {
    let income = 0;
    let outcome = 0;

    const values = this.transactions.filter(t => t.user_id === user_id);

    for (let i = 0; i < values.length; i += 1) {
      const transaction = values[i];

      if (transaction.type === 'income') {
        income += transaction.value;
      }

      if (transaction.type === 'outcome') {
        outcome += transaction.value;
      }
    }

    const balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }

  public async create({
    title,
    category_id,
    type,
    value,
    user_id,
  }: ICreateTransactionDTO): Promise<Transaction> {
    const transaction = new Transaction();

    Object.assign(transaction, {
      id: v4(),
      title,
      category_id,
      type,
      value,
      user_id,
    });

    this.transactions.push(transaction);

    return transaction;
  }

  public async getAllTransactions({
    user_id,
  }: IFindUserTransactionDTO): Promise<IGetAllTransactionsResponse> {
    const transactions = this.transactions.filter(
      transaction => transaction.user_id === user_id,
    );

    return {
      transactions,
      totalTransactions: transactions.length,
    };
  }

  public async deleteTransaction({ id }: IDeleteTransactionDTO): Promise<void> {
    const transaction = this.transactions.find(t => t.id === id);
    if (!transaction) return;
    const index = this.transactions.indexOf(transaction);

    if (index > -1) {
      this.transactions.splice(index, 1);
    }
  }

  public async findTransaction({
    id,
  }: IFindTransactionDTO): Promise<Transaction | undefined> {
    const transaction = this.transactions.find(t => t.id === id);

    return transaction;
  }

  public async createMultipleTransactions(
    transactions: ICreateMultipleTransactionsDTO,
  ): Promise<Transaction[]> {
    // const createdTransactions = new Transaction();

    const createdTransactions = transactions.transactions.map(transaction => ({
      title: transaction.title,
      type: transaction.type,
      value: transaction.value,
      user_id: transaction.user_id,
      category: transactions.categories.find(
        category => category.title === transaction.category,
      ),
    }));

    createdTransactions.map(t => {
      return this.transactions.push(t as Transaction);
    });

    return createdTransactions as Transaction[];
  }

  public async updateTransaction(
    newDataTransaction: IUpdateTransactionDTO,
  ): Promise<Transaction | undefined> {
    const { title, transaction_id, value, type } = newDataTransaction;

    const transaction = this.transactions.find(t => t.id === transaction_id);

    if (!transaction) {
      return undefined;
    }

    transaction.title = title;
    transaction.value = value;
    transaction.type = type;

    const transactionUpdated = this.transactions.find(
      t => t.id === transaction_id,
    );

    return transactionUpdated;
  }
}
