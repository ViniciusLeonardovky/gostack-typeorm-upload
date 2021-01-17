import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

import { TransactionsController } from '@modules/transactions/infra/http/controllers/TransactionsController';
import { ImportFilesController } from '@modules/transactions/infra/http/controllers/ImportFilesController';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

const transactionsController = new TransactionsController();
const importFilesController = new ImportFilesController();

transactionsRouter.get('/', transactionsController.index);

transactionsRouter.post('/', transactionsController.create);

transactionsRouter.delete('/:id', transactionsController.delete);

transactionsRouter.post(
  '/import',
  upload.single('file'),
  importFilesController.create,
);

export default transactionsRouter;
