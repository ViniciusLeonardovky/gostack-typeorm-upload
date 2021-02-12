import { getRepository, Repository } from 'typeorm';

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
    page,
  }: IFindUserTransactionDTO): Promise<IGetAllTransactionsResponse> {
    if (!page) {
      const totalTransactions = await this.ormRepository.count({
        where: { user_id },
      });
      const transactions = await this.ormRepository.find({
        where: { user_id },
        order: { created_at: 'DESC' },
      });

      return {
        transactions,
        totalTransactions,
      };
    }

    const transactionsPerPage = 10;
    const totalTransactions = await this.ormRepository.count({
      where: { user_id },
    });
    const transactions = await this.ormRepository.find({
      where: { user_id },
      skip: (page - 1) * transactionsPerPage,
      take: transactionsPerPage,
      order: { created_at: 'DESC' },
    });

    return {
      transactions,
      totalTransactions,
    };
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

  public async createMultipleTransactions(
    transactions: ICreateMultipleTransactionsDTO,
  ): Promise<Transaction[]> {
    const createdTransactions = this.ormRepository.create(
      transactions.transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        user_id: transaction.user_id,
        category: transactions.categories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await this.ormRepository.save(createdTransactions);

    return createdTransactions;
  }

  public async updateTransaction(
    newDataTransaction: IUpdateTransactionDTO,
  ): Promise<Transaction | undefined> {
    const { title, transaction_id, type, value } = newDataTransaction;

    await this.ormRepository.update(
      {
        id: transaction_id,
      },
      {
        title,
        type,
        value,
      },
    );

    const transaction = await this.ormRepository.findOne(transaction_id);

    return transaction;
  }
}
