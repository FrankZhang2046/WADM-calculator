import { AuthStateModel } from "../stores/states/auth.state";
import { TableStateModel } from "../stores/states/table.state";

export interface AppStateModel {
  user: AuthStateModel;
  table: TableStateModel;
}
