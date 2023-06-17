import { User } from "@angular/fire/auth";

export namespace AuthActions {
  export class RegisterCurrentUser {
    static readonly type = "[Auth] Register Current User";
    constructor(public payload: User | null) {}
  }
}
