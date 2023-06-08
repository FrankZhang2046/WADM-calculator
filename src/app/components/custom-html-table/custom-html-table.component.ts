import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import {
  ColumnHeaderData,
  TableRowData,
} from '../../models/table-row-data.model';

@Component({
  selector: 'app-custom-html-table',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    DragDropModule,
    MatIconModule,
  ],
  templateUrl: './custom-html-table.component.html',
  styleUrls: ['./custom-html-table.component.scss'],
})
export class CustomHtmlTableComponent {
  public displayResults: boolean = false;
  public columnDropMethod($event: CdkDragDrop<string[]>) {
    // shift order around with the moveItemsInArray method
    moveItemInArray(this.columnData, $event.previousIndex, $event.currentIndex);
    this.swapColumnsForTableData($event.previousIndex, $event.currentIndex);
  }

  // row drop method shifts the order of the tableData array around
  public rowDropMethod($event: CdkDragDrop<TableRowData[]>) {
    moveItemInArray(this.tableData, $event.previousIndex, $event.currentIndex);
  }

  public previousColIndex!: number | undefined;

  /*
    after column name swap, swap the indices for each table data's fieldValues array
   */
  public swapColumnsForTableData(fromIndex: number, toIndex: number) {
    this.tableData.forEach((tableData) => {
      moveItemInArray(tableData.fieldValues, fromIndex, toIndex);
    });
  }

  public columnData: ColumnHeaderData[] = [
    { columnName: 'one', result: null },
    { columnName: 'two', result: null },
    { columnName: 'three', result: null },
  ];
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
  public addCandidate(): void {
    this.columnData.push({ columnName: 'new', result: null });
    this.tableData.forEach((tableData) => {
      tableData.fieldValues.push(null);
    });
  }
  public addRow(): void {
    this.tableData.push({
      fieldName: 'new',
      fieldValues: Array(this.columnData.length).fill(null),
      fieldWeight: null,
    });
  }
}
