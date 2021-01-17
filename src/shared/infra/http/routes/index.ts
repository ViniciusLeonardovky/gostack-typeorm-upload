import { Router } from 'express';

import transactionsRouter from '@modules/transactions/infra/http/routes/transactions.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/transactions', transactionsRouter);

export default routes;
