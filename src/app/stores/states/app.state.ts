import {Injectable} from "@angular/core";
import {Action, State, StateContext} from "@ngxs/store";
import {ApplicationActions} from "../actions/app.action";

export interface ApplicationStateModel {
  appState: "tutorial" | "work" | null;
  dismissTutorialPermanently: boolean;
  dismissTutorialForSession: boolean;
}

@State<ApplicationStateModel>({
  name: "application",
  defaults: {
    appState: null,
    dismissTutorialForSession: false,
    dismissTutorialPermanently: false,
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

  @Action(ApplicationActions.UpdateTutorialDismissedPermanently)
  updateTutorialDismissedPermanently(
    ctx: StateContext<ApplicationStateModel>,
    action: ApplicationActions.UpdateTutorialDismissedPermanently
  ): void {
    ctx.patchState({
      dismissTutorialPermanently: action.payload,
    });
  }

  @Action(ApplicationActions.UpdateTutorialDismissedForSession)
  updateTutorialDismissedForSession(
    ctx: StateContext<ApplicationStateModel>,
    action: ApplicationActions.UpdateTutorialDismissedForSession
  ): void {
    ctx.patchState({
      dismissTutorialForSession: action.payload,
    });
  }
}
