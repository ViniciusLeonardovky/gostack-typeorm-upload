import { getRepository, In } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';

import { Transaction } from '@domains/transactions/infra/typeorm/entities/Transaction';
import { Category } from '@domains/transactions/infra/typeorm/entities/Category';

interface ICSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

export class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const transactionsRepository = getRepository(Transaction);
    const categoriesRepository = getRepository(Category);

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

      if (!title || !type || !value) return;

      categories.push(category);

      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      },
    });

    const existentCategoriesTitles = existentCategories.map(
      (category: Category) => category.title,
    );

    const addCategoryTitles = categories
      .filter(category => !existentCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoryTitles.map(title => ({
        title,
      })),
    );

    await categoriesRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existentCategories];

    const createdTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionsRepository.save(createdTransactions);

    fs.promises.unlink(filePath);
    return createdTransactions;
  }
}
