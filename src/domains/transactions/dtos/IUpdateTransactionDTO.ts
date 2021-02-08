export interface IUpdateTransactionDTO {
  transaction_id: string;
  title: string;
  value: number;
  type: 'income' | 'outcome';
}
