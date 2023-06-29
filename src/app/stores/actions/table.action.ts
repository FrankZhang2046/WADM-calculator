import {
  CachedPersistedTableDocument,
  TableData,
  TableRowData,
} from "./../../models/table-row-data.model";
import {
  ColumnHeaderData,
  LatestTableData,
  PersistedTableDocument,
  TableNameAndNotes,
} from "src/app/models/table-row-data.model";

export namespace TableActions {
  export class CacheCalculatedTableData {
    static readonly type = `[Table] Cache latest calculated table data`;

    constructor(public payload: TableData) {}
  }

  export class WriteTableDataToDB {
    static readonly type = `[Table] Write table data to DB`;

    constructor(public payload: LatestTableData) {}
  }

  export class UpdateTableData {
    static readonly type = `[Table] Update table data`;

    constructor(public payload: CachedPersistedTableDocument) {}
  }

  export class ResetRetrievedTableData {
    static readonly type = `[Table] Reset retrieved table data`;

    constructor() {}
  }

  export class RegisterRetrievedTableData {
    static readonly type = `[Table] Register retrieved table data`;

    constructor(
      public payload: {
        columnData: ColumnHeaderData[];
        tableRowData: TableRowData[];
      }
    ) {}
  }
}
