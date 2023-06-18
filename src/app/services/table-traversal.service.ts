import { Injectable } from "@angular/core";
import { TableOperationConstants } from "../models/enums";

@Injectable({
  providedIn: "root",
})
export class TableTraversalService {
  public tableOperationConstants = TableOperationConstants;

  constructor() {}
  // TODO extract the table traversal logic to this file
}
