import { Transaction } from '@domains/transactions/infra/typeorm/entities/Transaction';
import {
  ITransactionsRepository,
  IBalance,
} from '@domains/transactions/repositories/ITransactionsRepository';
import { ICreateTransactionDTO } from '@domains/transactions/dtos/ICreateTransactionDTO';
import { IDeleteTransactionDTO } from '@domains/transactions/dtos/IDeleteTransactionDTO';
import { IFindTransactionDTO } from '@domains/transactions/dtos/IFindTransactionDTO';
import { IFindUserTransactionDTO } from '@domains/transactions/dtos/IFindUserTransactionDTO';
import { v4 } from 'uuid';

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
  }: IFindUserTransactionDTO): Promise<Transaction[]> {
    const transactions = this.transactions.filter(
      transaction => transaction.user_id === user_id,
    );

    return transactions;
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
}
