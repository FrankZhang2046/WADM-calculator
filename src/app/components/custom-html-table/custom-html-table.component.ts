import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableOperationConstants } from 'src/app/models/enums';
import { MatInput, MatInputModule } from '@angular/material/input';
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
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-html-table',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    DragDropModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './custom-html-table.component.html',
  styleUrls: ['./custom-html-table.component.scss'],
})
export class CustomHtmlTableComponent implements OnInit {
  public tableOperationConstants = TableOperationConstants;
  public submitForm(tableElement: TableOperationConstants) {
    switch (tableElement) {
      case TableOperationConstants.columnHeader:
        this.columnHeaderRenamingFormControl.reset();
        this.headerBeingModified = null;
        break;
      default:
        break;
    }
  }
  @ViewChild(MatInput) public columnHeaderInput!: MatInput;
  public renameColumnHeader(colIdx: number) {
    this.headerBeingModified = colIdx;
    // have to defer the action to the next loop otherwise the ViewChild will be undefined
    setTimeout(() => {
      this.columnHeaderInput.focus();
    });
  }
  public displayResults: boolean = false;
  public headerBeingModified: number | null = null;
  // formControl for the column header renaming input component
  public columnHeaderRenamingFormControl = new FormControl<string>('');
  public columnDropMethod($event: CdkDragDrop<string[]>) {
    // shift order around with the moveItemsInArray method
    moveItemInArray(this.columnData, $event.previousIndex, $event.currentIndex);
    this.swapColumnsForTableData($event.previousIndex, $event.currentIndex);
  }

  public ngOnInit(): void {
    this.seedTable();

    this.columnHeaderRenamingFormControl.valueChanges.subscribe((value) => {
      if (this.headerBeingModified !== null) {
        if (value) {
          this.columnData[this.headerBeingModified].columnName = value;
        }
      }
    });
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
