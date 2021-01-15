import Transaction from '@modules/transactions/infra/typeorm/entities/Transaction';
import {
  IBalance,
  ITransactionRepository,
} from '@modules/transactions/repositories/ITransactionRepository';

interface IResponse {
  transactions: Transaction[];
  balance: IBalance;
}

class ListTransactionsService {
  constructor(private transactionsRepository: ITransactionRepository) {}

  public async execute(): Promise<IResponse> {
    const transactions = await this.transactionsRepository.getAllTransactions();
    const balance = await this.transactionsRepository.getBalance();

    const responseTransactions = { transactions, balance };

    return responseTransactions;
  }
}

export default ListTransactionsService;
