import { injectable, inject } from 'tsyringe';
import { Transaction } from '@modules/transactions/infra/typeorm/entities/Transaction';
import {
  IBalance,
  ITransactionsRepository,
} from '@modules/transactions/repositories/ITransactionsRepository';

interface IResponse {
  transactions: Transaction[];
  balance: IBalance;
}
@injectable()
export class ListTransactionsService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,
  ) {}

  public async execute(): Promise<IResponse> {
    const transactions = await this.transactionsRepository.getAllTransactions();
    const balance = await this.transactionsRepository.getBalance();

    const responseTransactions = { transactions, balance };

    return responseTransactions;
  }
}
