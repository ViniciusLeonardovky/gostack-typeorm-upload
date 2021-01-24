import { Router } from 'express';

import { UsersController } from '@domains/users/infra/http/controllers/UsersController';

export const usersRouter = Router();

const usersController = new UsersController();

usersRouter.post('/', usersController.create);
