import { User } from '@domains/users/infra/typeorm/entities/User';

import { ICreateUserDTO } from '@domains/users/dtos/ICreateUserDTO';

export interface IUsersRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(id: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
