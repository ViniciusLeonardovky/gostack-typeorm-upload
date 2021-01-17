import { Router } from 'express';

import { UsersController } from '@modules/users/infra/http/controllers/UsersController';

export const usersRouter = Router();

const usersController = new UsersController();

usersRouter.post('/', usersController.create);
