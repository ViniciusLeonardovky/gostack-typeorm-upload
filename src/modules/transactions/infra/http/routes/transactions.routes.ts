import { Router } from 'express';
import { container } from 'tsyringe';
import multer from 'multer';

import uploadConfig from '@config/upload';

import CreateTransactionService from '@modules/transactions/services/CreateTransactionService';
import DeleteTransactionService from '@modules/transactions/services/DeleteTransactionService';
import ImportTransactionsService from '@modules/transactions/services/ImportTransactionsService';
import ListTransactionsService from '@modules/transactions/services/ListTransactionsService';

const transactionsRouter = Router();

const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const listTransactions = container.resolve(ListTransactionsService);

  const transactions = await listTransactions.execute();

  return response.status(200).json(transactions);
});

transactionsRouter.post('/', async (request, response) => {
  try {
    const { title, value, type, category } = request.body;

    const createTransaction = container.resolve(CreateTransactionService);

    const transaction = await createTransaction.execute({
      title,
      value,
      type,
      category,
    });

    return response.status(200).json(transaction);
  } catch (err) {
    return response.status(400).json({ message: err.message, status: 'error' });
  }
});

transactionsRouter.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const deleteTransactionService = container.resolve(
      DeleteTransactionService,
    );

    await deleteTransactionService.execute(id);

    return response.status(204).json({});
  } catch (err) {
    return response.status(400).json({ message: err.message, status: 'error' });
  }
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    try {
      const { path } = request.file;

      const importTransactionsService = new ImportTransactionsService();

      const transactions = await importTransactionsService.execute(path);

      return response.status(200).json(transactions);
    } catch (err) {
      console.log(err);
      return response
        .status(400)
        .json({ message: err.message, status: 'error' });
    }
  },
);

export default transactionsRouter;
