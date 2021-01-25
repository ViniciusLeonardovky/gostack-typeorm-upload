import { injectable, inject } from 'tsyringe';
import csvParse from 'csv-parse';
import fs from 'fs';

import { Transaction } from '@domains/transactions/infra/typeorm/entities/Transaction';
import { Category } from '@domains/transactions/infra/typeorm/entities/Category';
import { ITransactionsRepository } from '@domains/transactions/repositories/ITransactionsRepository';
import { ICategoryTransactionsRepository } from '@domains/transactions/repositories/ICategoryTransactionsRepository';

interface ICSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
  user_id: string;
}

interface IRequest {
  filePath: string;
  user_id: string;
}

@injectable()
export class ImportTransactionsService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,

    @inject('CategoriesRepository')
    private categoriesRepository: ICategoryTransactionsRepository,
  ) {}

  public async execute({
    filePath,
    user_id,
  }: IRequest): Promise<Transaction[] | void> {
    const contactsReadStream = fs.createReadStream(filePath);

    const parses = csvParse({
      from_line: 2,
      trim: true,
      skip_empty_lines: true,
      delimiter: ';',
    });

    const parseCSV = contactsReadStream.pipe(parses);

    const transactions: ICSVTransaction[] = [];
    const categories: string[] = [];

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      categories.push(category);

      transactions.push({ title, type, value, category, user_id });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const existentCategories = await this.categoriesRepository.findCategories(
      categories,
    );

    const existentCategoriesTitles = existentCategories.map(
      (category: Category) => category.title,
    );

    const addCategoryTitles = categories
      .filter(category => !existentCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = await this.categoriesRepository.createMultipleCategories(
      addCategoryTitles,
    );

    const finalCategories = [...newCategories, ...existentCategories];

    const createdTransactions = this.transactionsRepository.createMultipleTransactions(
      { transactions, categories: finalCategories },
    );

    fs.promises.unlink(filePath);
    return createdTransactions;
  }
}
