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

export interface PersistedTableDocument {
  name: string;
  notes: string;
  tableData: {
    columnData: ColumnHeaderData[];
    tableRowData: TableRowData[];
  };
}

export interface LatestTableData {
  tableData: {
    columnData: ColumnHeaderData[];
    tableRowData: TableRowData[];
  };
}
