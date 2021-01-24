import { AppError } from '@shared/errors/AppError';
import { FakeHashProvider } from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository';
import { AuthenticateUserService } from '@modules/users/services/AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('Create User', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should authenticate a user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Nome Maneiro',
      email: 'maneiro@mail.com',
      password: '123123',
    });

    const response = await authenticateUser.execute({
      email: 'maneiro@mail.com',
      password: '123123',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not authenticate a user wrong e-mail', async () => {
    await fakeUsersRepository.create({
      name: 'Nome Maneiro',
      email: 'maneiro@mail.com',
      password: '123123',
    });

    await expect(
      authenticateUser.execute({
        email: 'nome@mail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not authenticate a user wrong password', async () => {
    await fakeUsersRepository.create({
      name: 'Nome Maneiro',
      email: 'maneiro@mail.com',
      password: '123123',
    });

    await expect(
      authenticateUser.execute({
        email: 'maneiro@mail.com',
        password: '123qwe',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
