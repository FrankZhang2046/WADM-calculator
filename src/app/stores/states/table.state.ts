import { Action, State, StateContext } from "@ngxs/store";
import {
  CacheLatestTableData,
  PersistTableInDB,
} from "../actions/table.action";
import { Injectable } from "@angular/core";
import {
  LatestTableData,
  PersistedTableDocument,
} from "src/app/models/table-row-data.model";

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
  @Action(CacheLatestTableData)
  cacheLatestTableData(
    ctx: StateContext<TableStateModel>,
    action: CacheLatestTableData
  ) {
    ctx.patchState({
      lastCalculatedTableData: action.payload,
    });
  }
}
