import { Router } from 'express';
import multer from 'multer';
import { uploadConfig } from '@config/upload';

import { TransactionsController } from '@modules/transactions/infra/http/controllers/TransactionsController';
import { ImportFilesController } from '@modules/transactions/infra/http/controllers/ImportFilesController';
import { ensureAuthenticated } from '@modules/users/infra/http/middlewares/ensureAuthenticated';

export const transactionsRouter = Router();
const upload = multer(uploadConfig);

const transactionsController = new TransactionsController();
const importFilesController = new ImportFilesController();

transactionsRouter.get('/', ensureAuthenticated, transactionsController.index);

transactionsRouter.post(
  '/',
  ensureAuthenticated,
  transactionsController.create,
);

transactionsRouter.delete(
  '/:id',
  ensureAuthenticated,
  transactionsController.delete,
);

transactionsRouter.post(
  '/import',
  ensureAuthenticated,
  upload.single('file'),
  importFilesController.create,
);
