import { AuthStateModel } from "../stores/states/auth.state";
import { TableStateModel } from "../stores/states/table.state";
import { ApplicationStateModel } from "../stores/states/app.state";

export interface AppReduxStateModel {
  user: AuthStateModel;
  table: TableStateModel;
  application: ApplicationStateModel;
}
