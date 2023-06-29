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
  lastCalculatedTableData: TableData;
  retrievedTableData: TableData;
}

@State<TableStateModel>({
  name: "table",
  defaults: {
    lastCalculatedTableData: {} as TableData,
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

  @Action(TableActions.UpdateTableData)
  updateTableData(
    ctx: StateContext<TableStateModel>,
    action: TableActions.UpdateTableData
  ) {
    return this.tableDataService.updateTableData(action.payload);
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
    return this.tableDataService.writeTableData(action.payload);
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
