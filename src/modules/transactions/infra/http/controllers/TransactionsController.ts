import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateTransactionService } from '@modules/transactions/services/CreateTransactionService';
import { DeleteTransactionService } from '@modules/transactions/services/DeleteTransactionService';
import { ListTransactionsService } from '@modules/transactions/services/ListTransactionsService';

export class TransactionsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listTransactions = container.resolve(ListTransactionsService);

    const transactions = await listTransactions.execute();

    return response.status(200).json(transactions);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { title, value, type, category } = request.body;
    const user_id = request.user.id;

    const createTransaction = container.resolve(CreateTransactionService);

    const transaction = await createTransaction.execute({
      title,
      value,
      type,
      category,
      user_id,
    });

    return response.status(200).json(transaction);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteTransactionService = container.resolve(
      DeleteTransactionService,
    );

    await deleteTransactionService.execute(id);

    return response.status(204).json({});
  }
}
