import { Category } from '@domains/transactions/infra/typeorm/entities/Category';
import { ICreateCategoryDTO } from '@domains/transactions/dtos/ICreateCategoryDTO';

export interface ICategoryTransactionsRepository {
  create(data: ICreateCategoryDTO): Promise<Category>;
  findCategory(title: string): Promise<Category | undefined>;
  findCategories(categories: string[]): Promise<Category[]>;
}
