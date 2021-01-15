import { Router } from 'express';

import transactionsRouter from '@modules/transactions/infra/http/routes/transactions.routes';

const routes = Router();

routes.use('/transactions', transactionsRouter);

export default routes;
