import { User } from "@angular/fire/auth";
import { AuthActions } from "../actions/user.action";
import { Action, StateContext, State } from "@ngxs/store";
import { Injectable } from "@angular/core";

export interface AuthStateModel {
  currentUser: User | null;
}

@State<AuthStateModel>({
  name: "user",
  defaults: {
    currentUser: null,
  },
})
@Injectable()
export class AuthState {
  @Action(AuthActions.RegisterCurrentUser)
  registerCurrentUser(
    ctx: StateContext<AuthStateModel>,
    action: AuthActions.RegisterCurrentUser
  ) {
    ctx.patchState({
      currentUser: action.payload,
    });
  }
}
