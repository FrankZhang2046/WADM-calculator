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

export interface TableNameAndNotes {
  tableName: string | null;
  tableNotes?: string | null;
}

export interface PersistedTableDocument {
  createdAt: object;
  tableName: string;
  tableNotes: string;
  tableData: {
    columnData: ColumnHeaderData[];
    tableRowData: TableRowData[];
  };
}

export interface LatestTableData {
  tableData: TableData;
  tableName: string | null;
  tableNotes?: string | null;
}

export interface TableData {
  columnData: ColumnHeaderData[];
  tableRowData: TableRowData[];
}
