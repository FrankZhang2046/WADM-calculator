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
  public submitForm() {
    switch (this.modifiedTableElementIdx.tableElement) {
      case this.tableOperationConstants.columnHeader:
        this.columnHeaderRenamingFormControl.reset();
        // todo extract the reusable part into methods
        this.modifiedTableElementIdx.tableElement = null;
        this.modifiedTableElementIdx.idx = null;
        break;
      case this.tableOperationConstants.rowHeader:
        this.columnHeaderRenamingFormControl.reset();
        this.modifiedTableElementIdx.tableElement = null;
        this.modifiedTableElementIdx.idx = null;
        break;
      default:
        break;
    }
  }
  @ViewChild(MatInput) public headerRenamingInputComponent!: MatInput;
  public displayResults: boolean = false;
  // public columnHeaderModifiedIdx: number | null = null;
  // formControl for the column header renaming input component
  public columnHeaderRenamingFormControl = new FormControl<string>('');
  public modifiedTableElementIdx: {
    tableElement: TableOperationConstants | null;
    idx: number | null | number[];
  } = { tableElement: null, idx: null };
  public rowHeaderRenamingFormControl = new FormControl<string>('');
  /*
    event handler when the user drag and drops to change the order of column headers
  */
  public columnDropMethod($event: CdkDragDrop<string[]>) {
    // shift order around with the moveItemsInArray method
    moveItemInArray(this.columnData, $event.previousIndex, $event.currentIndex);
    this.swapColumnsForTableData($event.previousIndex, $event.currentIndex);
  }

  public ngOnInit(): void {
    this.seedTable();

    this.columnHeaderRenamingFormControl.valueChanges.subscribe((value) => {
      if (value) {
        if (
          this.modifiedTableElementIdx.tableElement ===
          TableOperationConstants.columnHeader
        ) {
          this.columnData[
            this.modifiedTableElementIdx.idx as number
          ].columnName = value;
        } else if (
          this.modifiedTableElementIdx.tableElement ===
          this.tableOperationConstants.rowHeader
        ) {
          this.tableData[this.modifiedTableElementIdx.idx as number].fieldName =
            value;
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
    // * prompt user to rename the new column header immediately after creation
    this.modifyTableElement(
      TableOperationConstants.columnHeader,
      this.columnData.length - 1
    );
  }
  public addRow(): void {
    this.tableData.push({
      fieldName: 'new',
      fieldValues: Array(this.columnData.length).fill(null),
      fieldWeight: null,
    });
    // * prompt user to rename the new option immediately after creation
    this.modifyTableElement(
      TableOperationConstants.rowHeader,
      this.tableData.length - 1
    );
  }

  public modifyTableElement(
    tableElement: TableOperationConstants,
    idx: number | number[]
  ) {
    this.modifiedTableElementIdx = { tableElement, idx };
    // have to defer the action to the next loop otherwise the ViewChild will be undefined
    setTimeout(() => {
      this.headerRenamingInputComponent.focus();
    });
  }
}
