import { AuthStateModel } from "./auth.state";
import { TableStateModel } from "./table.state";

export interface AppStateModel {
  user: AuthStateModel;
  table: TableStateModel;
}
