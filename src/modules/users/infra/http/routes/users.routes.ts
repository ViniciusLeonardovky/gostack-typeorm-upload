import { Router } from 'express';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import BCryptHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';
import CreateUserService from '@modules/users/services/CreateUserService';

const usersRouter = Router();

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const usersRepository = new UsersRepository();
    const bCryptHashProvider = new BCryptHashProvider();

    const createUser = new CreateUserService(
      usersRepository,
      bCryptHashProvider,
    );

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    return response.status(200).json(user);
  } catch (err) {
    return response.status(400).json({ message: err.message, status: 'error' });
  }
});

export default usersRouter;
