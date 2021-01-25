export interface ICSVTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
  user_id: string;
}

interface ICategory {
  title: string;
}

export interface ICreateMultipleTransactionsDTO {
  transactions: ICSVTransaction[];
  categories: ICategory[];
}
