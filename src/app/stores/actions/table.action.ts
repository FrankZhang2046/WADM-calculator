import { PersistedTableDocument } from "src/app/models/table-row-data.model";

export class PersistTableInDB {
  static readonly type = `[Table] Persist table in DB`;
  constructor(public payload: PersistedTableDocument) {}
}
