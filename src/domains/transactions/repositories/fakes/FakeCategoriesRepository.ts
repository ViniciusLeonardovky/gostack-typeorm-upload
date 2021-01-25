import { Category } from '@domains/transactions/infra/typeorm/entities/Category';

import { ICategoryTransactionsRepository } from '@domains/transactions/repositories/ICategoryTransactionsRepository';
import { ICreateCategoryDTO } from '@domains/transactions/dtos/ICreateCategoryDTO';
import { v4 } from 'uuid';

export class FakeCategoriesRepository
  implements ICategoryTransactionsRepository {
  private categories: Category[] = [];

  public async findCategory(title: string): Promise<Category | undefined> {
    const category = this.categories.find(c => c.title === title);

    return category || undefined;
  }

  public async findCategories(categories: string[]): Promise<Category[]> {
    const existentCategories = this.categories.filter(
      c => categories.includes(c.title) === true,
    );

    return existentCategories;
  }

  public async create({ title }: ICreateCategoryDTO): Promise<Category> {
    const category = new Category();

    Object.assign(category, {
      id: v4(),
      title,
    });

    this.categories.push(category);

    return category;
  }
}
