export interface TableRowData {
  fieldName: string;
  // fieldValues is an array consisting of numbers, or null values
  fieldValues: (number | null)[];
  fieldWeight: number;
}

export interface ColumnHeaderData {
  columnName: string;
  result: number | null;
}
