import { Pipe, PipeTransform } from '@angular/core';
import { TableOperationConstants } from '../models/enums';

@Pipe({
  name: 'tableElementVisibilityPipe',
  standalone: true,
})
export class TableElementVisibilityPipePipe implements PipeTransform {
  transform(
    modifiedTableElementIdx: {
      tableElement: TableOperationConstants | null;
      idx: number | number[] | null;
    },
    targetTableElement: TableOperationConstants,
    targetIdx: number
  ): boolean {
    if (modifiedTableElementIdx.tableElement === null) {
      return true;
    } else {
      if (
        modifiedTableElementIdx.tableElement === targetTableElement &&
        modifiedTableElementIdx.idx === targetIdx
      ) {
        return false;
      } else return true;
    }
  }
}
