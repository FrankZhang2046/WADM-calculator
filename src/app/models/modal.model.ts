import {
  CachedPersistedTableDocument,
  LatestTableData,
} from "./table-row-data.model";

export interface SaveTableDataModalData {
  type: "save" | "edit";
  tableData: any;
}
