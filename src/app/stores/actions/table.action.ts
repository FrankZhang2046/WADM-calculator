import {
  LatestTableData,
  PersistedTableDocument,
} from "src/app/models/table-row-data.model";

export class PersistTableInDB {
  static readonly type = `[Table] Persist table in DB`;
  constructor(public payload: PersistedTableDocument) {}
}
export class CacheLatestTableData {
  static readonly type = `[Table] Cache latest table data`;
  constructor(public payload: LatestTableData) {}
}
