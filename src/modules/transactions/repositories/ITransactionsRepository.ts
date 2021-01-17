import { Transaction } from '@modules/transactions/infra/typeorm/entities/Transaction';
import { ICreateTransactionDTO } from '@modules/transactions/dtos/ICreateTransactionDTO';
import { IDeleteTransactionDTO } from '@modules/transactions/dtos/IDeleteTransactionDTO';
import { IFindTransactionDTO } from '@modules/transactions/dtos/IFindTransactionDTO';

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
