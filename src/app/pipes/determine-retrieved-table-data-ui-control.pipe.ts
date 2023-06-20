import { Pipe, PipeTransform } from "@angular/core";
import { TableData } from "../models/table-row-data.model";

@Pipe({
  name: "determineRetrievedTableDataUIControl",
  standalone: true,
})
export class DetermineRetrievedTableDataUIControlPipe implements PipeTransform {
  transform(payload: TableData | null): boolean {
    if (payload) {
      return Object.keys(payload).length > 0;
    } else return false;
  }
}
