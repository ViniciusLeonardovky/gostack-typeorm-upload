import Category from '@modules/transactions/infra/typeorm/entities/Category';
import ICreateCategoryDTO from '@modules/transactions/dtos/ICreateCategoryDTO';

export interface ICategoryTransactionsRepository {
  create(data: ICreateCategoryDTO): Promise<Category>;
  findCategory(title: string): Promise<Category | undefined>;
}
