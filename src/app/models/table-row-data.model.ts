export interface TableRowData {
  fieldName: string;
  // fieldValues is an array consisting of numbers, or null values
  fieldValues: (number | null)[];
  fieldWeight: number | null;
}

export interface ColumnHeaderData {
  columnName: string;
  result: number;
}
