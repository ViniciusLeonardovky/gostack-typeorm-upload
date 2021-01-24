import { Transaction } from '@domains/transactions/infra/typeorm/entities/Transaction';
import { ICreateTransactionDTO } from '@domains/transactions/dtos/ICreateTransactionDTO';
import { IDeleteTransactionDTO } from '@domains/transactions/dtos/IDeleteTransactionDTO';
import { IFindTransactionDTO } from '@domains/transactions/dtos/IFindTransactionDTO';

export interface IBalance {
  income: number;
  outcome: number;
  total: number;
}

export interface ITransactionsRepository {
  create(data: ICreateTransactionDTO): Promise<Transaction>;
  getBalance(): Promise<IBalance>;
  getAllTransactions(): Promise<Transaction[]>;
  deleteTransaction(data: IDeleteTransactionDTO): Promise<void>;
  findTransaction(data: IFindTransactionDTO): Promise<Transaction | undefined>;
}
