import { Router } from 'express';

import { transactionsRouter } from '@domains/transactions/infra/http/routes/transactions.routes';
import { usersRouter } from '@domains/users/infra/http/routes/users.routes';
import { sessionsRouter } from '@domains/users/infra/http/routes/sessions.routes';

export const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/transactions', transactionsRouter);
