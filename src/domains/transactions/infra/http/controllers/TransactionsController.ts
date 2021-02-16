import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateTransactionService } from '@domains/transactions/services/CreateTransactionService';
import { DeleteTransactionService } from '@domains/transactions/services/DeleteTransactionService';
import { ListTransactionsService } from '@domains/transactions/services/ListTransactionsService';
import { UpdateTransactionService } from '@domains/transactions/services/UpdateTransactionService';

export class TransactionsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listTransactions = container.resolve(ListTransactionsService);
    const user_id = request.user.id;
    const { page, limit } = request.query;

    const transactions = await listTransactions.execute({
      user_id,
      page: Number(page),
      limitPerPage: Number(limit),
    });

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

  public async update(request: Request, response: Response): Promise<Response> {
    const { transaction_id } = request.params;
    const { title, value, type } = request.body;

    const updateTransaction = container.resolve(UpdateTransactionService);

    const transaction = await updateTransaction.execute({
      transaction_id,
      title,
      value,
      type,
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
