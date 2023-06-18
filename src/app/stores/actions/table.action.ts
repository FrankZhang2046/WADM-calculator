import {
  LatestTableData,
  PersistedTableDocument,
  TableNameAndNotes,
} from "src/app/models/table-row-data.model";

export namespace TableActions {
  export class CacheLatestTableData {
    static readonly type = `[Table] Cache latest table data`;
    constructor(public payload: LatestTableData) {}
  }

  export class WriteTableDataToDB {
    static readonly type = `[Table] Write table data to DB`;
    constructor(public payload: TableNameAndNotes) {}
  }
}
