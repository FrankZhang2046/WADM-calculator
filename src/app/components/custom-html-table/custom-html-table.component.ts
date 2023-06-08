import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {TableRowData} from "../../models/table-row-data.model";

@Component({
  selector: 'app-custom-html-table',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatButtonModule, DragDropModule],
  templateUrl: './custom-html-table.component.html',
  styleUrls: ['./custom-html-table.component.scss'],
})
export class CustomHtmlTableComponent {
  columnDropMethod($event: any) {
    // shift order around with the moveItemsInArray method
    moveItemInArray(this.columnData, $event.previousIndex, $event.currentIndex);
    this.swapColumnsForTableData($event.previousIndex, $event.currentIndex);
  }

  public previousColIndex!: number | undefined;

  dragStartedMethod(index: number) {
    this.previousColIndex = index;
  }

  /*
    after column name swap, swap the indices for each table data's fieldValues array
   */
  public swapColumnsForTableData(fromIndex: number, toIndex: number) {
    this.tableData.forEach((tableData) => {
      moveItemInArray(tableData.fieldValues, fromIndex, toIndex);
    });
  }

  columnDroppedMethod(index: number) {
    if (this.previousColIndex) {
      moveItemInArray(this.columnData, this.previousColIndex, index);
      console.log(`updated array: `, this.columnData);
      this.previousColIndex = undefined;
    }
  }

  public columnData = ['one', 'two', 'three'];
  public tableData: TableRowData[] = [
    {
      fieldName: 'Taste',
      fieldValues: [1, 2, 3],
      fieldWeight: 10,
    },
    {
      fieldName: 'Healthiness',
      fieldValues: [1, 2, 3],
      fieldWeight: 9,
    },
    {
      fieldName: 'Cost',
      fieldValues: [1, 2, 3],
      fieldWeight: 10,
    },
  ];
  public resultsData: number[] = [];
}
