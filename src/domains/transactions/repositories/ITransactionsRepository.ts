import { Transaction } from '@domains/transactions/infra/typeorm/entities/Transaction';
import { ICreateTransactionDTO } from '@domains/transactions/dtos/ICreateTransactionDTO';
import { IDeleteTransactionDTO } from '@domains/transactions/dtos/IDeleteTransactionDTO';
import { IFindTransactionDTO } from '@domains/transactions/dtos/IFindTransactionDTO';
import { IFindUserTransactionDTO } from '@domains/transactions/dtos/IFindUserTransactionDTO';
import { ICreateMultipleTransactionsDTO } from '@domains/transactions/dtos/ICreateMultipleTransactionsDTO';
import { IUpdateTransactionDTO } from '@domains/transactions/dtos/IUpdateTransactionDTO';

export interface IBalance {
  income: number;
  outcome: number;
  total: number;
}

export interface ITransactionsRepository {
  create(data: ICreateTransactionDTO): Promise<Transaction>;
  getBalance(data: IFindUserTransactionDTO): Promise<IBalance>;
  getAllTransactions(data: IFindUserTransactionDTO): Promise<Transaction[]>;
  deleteTransaction(data: IDeleteTransactionDTO): Promise<void>;
  findTransaction(data: IFindTransactionDTO): Promise<Transaction | undefined>;
  createMultipleTransactions(
    data: ICreateMultipleTransactionsDTO,
  ): Promise<Transaction[]>;
  updateTransaction(
    data: IUpdateTransactionDTO,
  ): Promise<Transaction | undefined>;
}
