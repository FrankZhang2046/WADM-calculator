import { Injectable } from "@angular/core";
import { Action, State, StateContext } from "@ngxs/store";
import { ApplicationActions } from "../actions/app.action";

export interface ApplicationStateModel {
  appState: "tutorial" | "work" | null;
}

@State<ApplicationStateModel>({
  name: "application",
  defaults: {
    appState: null,
  },
})
@Injectable()
export class ApplicationState {
  @Action(ApplicationActions.UpdateApplicationState)
  updateApplicationState(
    ctx: StateContext<ApplicationStateModel>,
    action: ApplicationActions.UpdateApplicationState
  ): void {
    ctx.patchState({
      appState: action.payload,
    });
  }
}
