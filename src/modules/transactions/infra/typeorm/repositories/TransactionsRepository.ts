import { getRepository, Repository } from 'typeorm';

import { Transaction } from '@modules/transactions/infra/typeorm/entities/Transaction';
import {
  ITransactionsRepository,
  IBalance,
} from '@modules/transactions/repositories/ITransactionsRepository';
import { ICreateTransactionDTO } from '@modules/transactions/dtos/ICreateTransactionDTO';
import { IDeleteTransactionDTO } from '@modules/transactions/dtos/IDeleteTransactionDTO';
import { IFindTransactionDTO } from '@modules/transactions/dtos/IFindTransactionDTO';

export class TransactionsRepository implements ITransactionsRepository {
  private ormRepository: Repository<Transaction>;

  constructor() {
    this.ormRepository = getRepository(Transaction);
  }

  public async getBalance(): Promise<IBalance> {
    let income = 0;
    let outcome = 0;

    const values = await this.ormRepository.find();

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
  }: ICreateTransactionDTO): Promise<Transaction> {
    const transaction = this.ormRepository.create({
      title,
      category_id,
      type,
      value,
    });

    await this.ormRepository.save(transaction);

    return transaction;
  }

  public async getAllTransactions(): Promise<Transaction[]> {
    const transactions = await this.ormRepository.find();

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
