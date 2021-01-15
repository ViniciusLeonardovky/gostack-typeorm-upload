import Transaction from '@modules/transactions/infra/typeorm/entities/Transaction';
import ICreateTransactionDTO from '@modules/transactions/dtos/ICreateTransactionDTO';

export interface IBalance {
  income: number;
  outcome: number;
  total: number;
}

export interface ITransactionRepository {
  create(data: ICreateTransactionDTO): Promise<Transaction>;
  getBalance(): Promise<IBalance>;
  getAllTransactions(): Promise<Transaction[]>;
}
