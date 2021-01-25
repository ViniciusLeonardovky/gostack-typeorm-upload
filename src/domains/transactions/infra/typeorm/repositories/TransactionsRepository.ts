import { getRepository, Repository } from 'typeorm';

import { Transaction } from '@domains/transactions/infra/typeorm/entities/Transaction';
import {
  ITransactionsRepository,
  IBalance,
} from '@domains/transactions/repositories/ITransactionsRepository';
import { ICreateTransactionDTO } from '@domains/transactions/dtos/ICreateTransactionDTO';
import { IDeleteTransactionDTO } from '@domains/transactions/dtos/IDeleteTransactionDTO';
import { IFindTransactionDTO } from '@domains/transactions/dtos/IFindTransactionDTO';
import { IFindUserTransactionDTO } from '@domains/transactions/dtos/IFindUserTransactionDTO';

export class TransactionsRepository implements ITransactionsRepository {
  private ormRepository: Repository<Transaction>;

  constructor() {
    this.ormRepository = getRepository(Transaction);
  }

  public async getBalance({
    user_id,
  }: IFindUserTransactionDTO): Promise<IBalance> {
    let income = 0;
    let outcome = 0;

    const values = await this.ormRepository.find({ where: { user_id } });

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
    const transaction = this.ormRepository.create({
      title,
      category_id,
      type,
      value,
      user_id,
    });

    await this.ormRepository.save(transaction);

    return transaction;
  }

  public async getAllTransactions({
    user_id,
  }: IFindUserTransactionDTO): Promise<Transaction[]> {
    const transactions = await this.ormRepository.find({ where: { user_id } });

    return transactions;
  }

  public async deleteTransaction({ id }: IDeleteTransactionDTO): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async findTransaction({
    id,
  }: IFindTransactionDTO): Promise<Transaction | undefined> {
    const transaction = await this.ormRepository.findOne(id);

    return transaction;
  }
}
