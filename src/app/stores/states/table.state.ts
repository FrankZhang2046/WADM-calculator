import { Action, State, StateContext } from "@ngxs/store";
import { PersistTableInDB } from "../actions/table.action";
import { Injectable } from "@angular/core";
import { PersistedTableDocument } from "src/app/models/table-row-data.model";

export interface TableStateModel {
  lastSubmittedTableState: PersistedTableDocument;
}

@State<TableStateModel>({
  name: "table",
  defaults: {
    lastSubmittedTableState: {} as PersistedTableDocument,
  },
})
@Injectable()
export class TableState {
  @Action(PersistTableInDB)
  persistTableDataInDB(
    ctx: StateContext<TableStateModel>,
    action: PersistTableInDB
  ) {
    ctx.setState({
      lastSubmittedTableState: action.payload,
    });
  }
}
