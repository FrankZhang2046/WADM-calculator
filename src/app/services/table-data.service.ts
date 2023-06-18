import { Injectable } from "@angular/core";
import { PersistedTableDocument } from "../models/table-row-data.model";

@Injectable({
  providedIn: "root",
})
export class TableDataService {
  constructor() {}
  /* method that writes table data to db
    @param tableData: table data to be written to db
  */
  writeTableData(tableData: PersistedTableDocument) {}
}
