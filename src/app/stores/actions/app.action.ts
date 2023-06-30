export namespace ApplicationActions {
  export class UpdateApplicationState {
    static readonly type = "[Application] Update Application State";

    constructor(public payload: "work" | "tutorial" | null) {}
  }
}
