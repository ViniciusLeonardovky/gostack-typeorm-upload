import { IUsersRepository } from '@domains/users/repositories/IUsersRepository';
import { ICreateUserDTO } from '@domains/users/dtos/ICreateUserDTO';

import { User } from '@domains/users/infra/typeorm/entities/User';

export class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const user = this.users.find(u => u.id === id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find(u => u.email === email);

    return user;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: Math.random().toString() }, userData);

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return user;
  }
}
