import { injectable, inject } from 'tsyringe';
import { Transaction } from '@domains/transactions/infra/typeorm/entities/Transaction';
import {
  IBalance,
  ITransactionsRepository,
} from '@domains/transactions/repositories/ITransactionsRepository';

interface IRequest {
  user_id: string;
}
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

  public async execute({ user_id }: IRequest): Promise<IResponse> {
    const transactions = await this.transactionsRepository.getAllTransactions({
      user_id,
    });
    const balance = await this.transactionsRepository.getBalance({ user_id });

    const responseTransactions = { transactions, balance };

    return responseTransactions;
  }
}
