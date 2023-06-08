export interface TableRowData {
  fieldName: string;
  fieldValues: number[];
}

export interface CriterionWeight {
  [fieldName: string]: number;
}
