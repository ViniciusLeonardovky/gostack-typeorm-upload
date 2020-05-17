import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

interface CategoryDTO {
  id: string;
  title: string;
  created_at: Date;
  updated_at: Date;
}

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async findCategory(title: string): Promise<CategoryDTO | null> {
    const category = await this.findOne({ where: { title } });

    return category || null;
  }
}

export default CategoriesRepository;
