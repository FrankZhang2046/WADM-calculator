export interface TableRowData {
  fieldName: string;
  fieldValues: number[];
  fieldWeight: number;
}

export interface ColumnHeaderData {
  columnName: string;
  result: number | null;
}
