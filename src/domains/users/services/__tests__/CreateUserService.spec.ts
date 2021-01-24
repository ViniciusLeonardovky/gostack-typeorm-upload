import { AppError } from '@shared/errors/AppError';
import { FakeHashProvider } from '@domains/users/providers/HashProvider/fakes/FakeHashProvider';
import { FakeUsersRepository } from '@domains/users/repositories/fakes/FakeUsersRepository';
import { CreateUserService } from '@domains/users/services/CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('Create User', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should create a new user', async () => {
    const user = await createUser.execute({
      name: 'Nome Maneiro',
      email: 'maneiro@mail.com',
      password: '123123',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not create a user when email already registerd', async () => {
    await createUser.execute({
      name: 'Nome Legal',
      email: 'maneiro@mail.com',
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'Nome Maneiro',
        email: 'maneiro@mail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
