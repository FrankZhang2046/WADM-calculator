import { Component, OnInit } from '@angular/core';
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
export class CustomHtmlTableComponent implements OnInit {
  public displayResults: boolean = false;
  public columnDropMethod($event: CdkDragDrop<string[]>) {
    // shift order around with the moveItemsInArray method
    moveItemInArray(this.columnData, $event.previousIndex, $event.currentIndex);
    this.swapColumnsForTableData($event.previousIndex, $event.currentIndex);
  }

  public ngOnInit(): void {
    this.seedTable();
  }

  /*
    when the table is empty, populate the table with some startup data
  */
  private seedTable() {
    if (this.columnData.length === 0) {
      this.columnData.push({ columnName: 'Option 1', result: null });
      this.columnData.push({ columnName: 'Option 2', result: null });
    }
    if (this.tableData.length === 0) {
      this.tableData.push({
        fieldName: 'Criterion 1',
        fieldValues: [null, null],
        fieldWeight: null,
      });
    }
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

  public columnData: ColumnHeaderData[] = [];
  public tableData: TableRowData[] = [];

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
