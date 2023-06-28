import { AuthStateModel } from "./auth.state";
import { TableStateModel } from "./table.state";

export interface AppState {
  user: AuthStateModel;
  table: TableStateModel;
}
