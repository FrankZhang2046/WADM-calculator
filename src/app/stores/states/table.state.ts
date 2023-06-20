import { Action, State, StateContext } from "@ngxs/store";
import { TableActions } from "../actions/table.action";
import { Injectable } from "@angular/core";
import {
  LatestTableData,
  PersistedTableDocument,
  TableData,
  TableNameAndNotes,
} from "src/app/models/table-row-data.model";
import { TableDataService } from "src/app/services/table-data.service";
import { Firestore } from "@angular/fire/firestore";

export interface TableStateModel {
  lastCalculatedTableData: LatestTableData;
  retrievedTableData: TableData;
}

@State<TableStateModel>({
  name: "table",
  defaults: {
    lastCalculatedTableData: {} as LatestTableData,
    retrievedTableData: {} as TableData,
  },
})
@Injectable()
export class TableState {
  constructor(private tableDataService: TableDataService) {}
  @Action(TableActions.RegisterRetrievedTableData)
  cacheRetrievedTableData(
    ctx: StateContext<TableStateModel>,
    action: TableActions.RegisterRetrievedTableData
  ) {
    ctx.patchState({ retrievedTableData: action.payload });
  }
  @Action(TableActions.ResetRetrievedTableData)
  calculateTableData(
    ctx: StateContext<TableStateModel>,
    action: TableActions.ResetRetrievedTableData
  ) {
    ctx.patchState({ retrievedTableData: {} as TableData });
  }
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
  @Action(TableActions.CacheCalculatedTableData)
  cacheLatestTableData(
    ctx: StateContext<TableStateModel>,
    action: TableActions.CacheCalculatedTableData
  ) {
    ctx.patchState({
      lastCalculatedTableData: action.payload,
    });
  }
}
