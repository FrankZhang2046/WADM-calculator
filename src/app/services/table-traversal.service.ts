import { Injectable } from "@angular/core";
import { TableOperationConstants } from "../models/enums";

@Injectable({
  providedIn: "root",
})
export class TableTraversalService {
  public tableOperationConstants = TableOperationConstants;

  constructor() {}
}
