export namespace ApplicationActions {
  export class UpdateApplicationState {
    static readonly type = "[Application] Update Application State";

    constructor(public payload: "work" | "tutorial" | null) {
    }
  }

  export class UpdateTutorialDismissedForSession {
    static readonly type = "[Application] Update Tutorial Dismissed For Session";

    constructor(public payload: boolean) {
    }
  }

  export class UpdateTutorialDismissedPermanently {
    static readonly type = "[Application] Update Tutorial Dismissed Permanently";

    constructor(public payload: boolean) {
    }
  }
}
