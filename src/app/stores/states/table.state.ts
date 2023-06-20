import { Action, State, StateContext } from "@ngxs/store";
import { TableActions } from "../actions/table.action";
import { Injectable } from "@angular/core";
import {
  LatestTableData,
  PersistedTableDocument,
  TableNameAndNotes,
} from "src/app/models/table-row-data.model";
import { TableDataService } from "src/app/services/table-data.service";
import { Firestore } from "@angular/fire/firestore";

export interface TableStateModel {
  lastCalculatedTableData: LatestTableData;
}

@State<TableStateModel>({
  name: "table",
  defaults: {
    lastCalculatedTableData: {} as LatestTableData,
  },
})
@Injectable()
export class TableState {
  constructor(private tableDataService: TableDataService) {}

  @Action(TableActions.WriteTableDataToDB)
  writeTableDataToDB(
    ctx: StateContext<TableStateModel>,
    action: TableActions.WriteTableDataToDB
  ) {
    const tableData = ctx.getState().lastCalculatedTableData;
    tableData.tableName = action.payload.tableName;
    tableData.tableNotes = action.payload.tableNotes;

    return this.tableDataService.writeTableData(tableData);
  }
  @Action(TableActions.CacheLatestTableData)
  cacheLatestTableData(
    ctx: StateContext<TableStateModel>,
    action: TableActions.CacheLatestTableData
  ) {
    ctx.patchState({
      lastCalculatedTableData: action.payload,
    });
  }
}
