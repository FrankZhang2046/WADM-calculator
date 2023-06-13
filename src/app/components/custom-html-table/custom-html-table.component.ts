import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableOperationConstants } from "src/app/models/enums";
import { MatInput, MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import {
  ColumnHeaderData,
  TableRowData,
} from "../../models/table-row-data.model";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { AssertArrayEqualityPipe } from "../../pipes/assert-array-equality.pipe";

@Component({
  selector: "app-custom-html-table",
  standalone: true,
  imports: [
    AssertArrayEqualityPipe,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    DragDropModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: "./custom-html-table.component.html",
  styleUrls: ["./custom-html-table.component.scss"],
})
export class CustomHtmlTableComponent implements OnInit {
  public tableOperationConstants = TableOperationConstants;

  public submitForm() {
    switch (this.modifiedTableElementIdx.tableElement) {
      case this.tableOperationConstants.columnHeader:
        this.resetAfterFormSubmission(
          this.tableOperationConstants.columnHeader
        );
        break;
      case this.tableOperationConstants.rowHeader:
        this.resetAfterFormSubmission(this.tableOperationConstants.rowHeader);
        break;
      case this.tableOperationConstants.cell:
        this.resetAfterFormSubmission(this.tableOperationConstants.cell);
        break;
      case this.tableOperationConstants.fieldWeight:
        this.resetAfterFormSubmission(this.tableOperationConstants.fieldWeight);
        break;
      default:
        break;
    }
  }

  @HostListener("window:keydown", ["$event"])
  public keyEvent(event: KeyboardEvent) {
    console.log(`key pressed is:`, event.key);
    // switch statement to specify the procedure of different keystrokes:
    switch (event.key) {
      // if arrow right is pressed, console.log it
      case "ArrowRight":
        this.tableTraversal(event.key);
        break;
      case "ArrowLeft":
        this.tableTraversal(event.key);
        break;
      case "ArrowDown":
        this.tableTraversal(event.key);
        break;
      case "ArrowUp":
        this.tableTraversal(event.key);
        break;
      case "Enter":
        // todo extract this procedure into a method
        if (this.highlightedTableElementIdx.tableElement !== null) {
          this.modifyTableElement(
            this.highlightedTableElementIdx.tableElement,
            this.highlightedTableElementIdx.idx
          );
          this.clearHighlightedTableElement();
        }
        break;
      case "Escape":
        this.clearHighlightedTableElement();
        if (this.modifiedTableElementIdx.tableElement !== null) {
          this.submitForm();
        }
        break;
      case "/":
        // * initiate table traversal
        if (this.cachedHighlightedTableElementIdx.tableElement === null) {
          this.highlightTableElement(
            this.tableOperationConstants.columnHeader,
            [0]
          );
        } else {
          this.initiateTableTraversal();
        }
        break;
      default:
        break;
    }
  }

  /*
  method for traversing through table elements with the arrow keys
   */
  public tableTraversal(keystroke: string): void {
    if (
      this.highlightedTableElementIdx.tableElement ===
      this.tableOperationConstants.columnHeader
    ) {
      switch (keystroke) {
        case "ArrowRight":
          if (
            this.highlightedTableElementIdx.idx[0] <
            this.columnData.length - 1
          ) {
            this.highlightTableElement(
              this.tableOperationConstants.columnHeader,
              [this.highlightedTableElementIdx.idx[0] + 1]
            );
          }
          break;
        case "ArrowLeft":
          if (this.highlightedTableElementIdx.idx[0] > 0) {
            this.highlightTableElement(
              this.tableOperationConstants.columnHeader,
              [this.highlightedTableElementIdx.idx[0] - 1]
            );
          }
          break;
        case "ArrowDown":
          this.highlightTableElement(this.tableOperationConstants.cell, [
            0,
            this.highlightedTableElementIdx.idx[0],
          ]);
          break;
        default:
          break;
      }
    } else if (
      this.highlightedTableElementIdx.tableElement ===
      this.tableOperationConstants.cell
    ) {
      switch (keystroke) {
        case "ArrowRight":
          if (
            this.highlightedTableElementIdx.idx[1] <
            this.columnData.length - 1
          ) {
            this.highlightTableElement(this.tableOperationConstants.cell, [
              this.highlightedTableElementIdx.idx[0],
              this.highlightedTableElementIdx.idx[1] + 1,
            ]);
          }
          break;
        case "ArrowLeft":
          if (this.highlightedTableElementIdx.idx[1] > 0) {
            this.highlightTableElement(this.tableOperationConstants.cell, [
              this.highlightedTableElementIdx.idx[0],
              this.highlightedTableElementIdx.idx[1] - 1,
            ]);
          } else {
            // * transition to the fieldWeight block of the corresponding row
            this.highlightTableElement(
              this.tableOperationConstants.fieldWeight,
              [this.highlightedTableElementIdx.idx[0]]
            );
          }
          break;
        case "ArrowDown":
          this.highlightTableElement(this.tableOperationConstants.cell, [
            Math.min(
              this.highlightedTableElementIdx.idx[0] + 1,
              this.tableData.length - 1
            ),
            this.highlightedTableElementIdx.idx[1],
          ]);
          break;
        case "ArrowUp":
          if (this.highlightedTableElementIdx.idx[0] > 0) {
            this.highlightTableElement(this.tableOperationConstants.cell, [
              this.highlightedTableElementIdx.idx[0] - 1,
              this.highlightedTableElementIdx.idx[1],
            ]);
          } else {
            this.highlightTableElement(
              this.tableOperationConstants.columnHeader,
              [this.highlightedTableElementIdx.idx[1]]
            );
          }
          break;
        default:
          break;
      }
    } else if (
      this.highlightedTableElementIdx.tableElement ===
      this.tableOperationConstants.fieldWeight
    ) {
      switch (keystroke) {
        case "ArrowRight":
          // * transition to the cells block for the corresponding row
          this.highlightTableElement(this.tableOperationConstants.cell, [
            this.highlightedTableElementIdx.idx[0],
            0,
          ]);
          break;
        case "ArrowLeft":
          // when the fieldWeight cell is highlighted, when you go left, highlight the corresponding row header
          this.highlightTableElement(
            this.tableOperationConstants.rowHeader,
            this.highlightedTableElementIdx.idx
          );
          break;
        default:
          break;
      }
    } else if (
      this.highlightedTableElementIdx.tableElement ===
      this.tableOperationConstants.rowHeader
    ) {
      switch (keystroke) {
        case "ArrowRight":
          // * transition to the fieldWeight block for the corresponding row
          this.highlightTableElement(
            this.tableOperationConstants.fieldWeight,
            this.highlightedTableElementIdx.idx
          );
          break;
        case "ArrowDown":
          if (
            this.highlightedTableElementIdx.idx[0] <
            this.tableData.length - 1
          ) {
            this.highlightTableElement(this.tableOperationConstants.rowHeader, [
              this.highlightedTableElementIdx.idx[0] + 1,
            ]);
          }
          break;
        case "ArrowUp":
          if (this.highlightedTableElementIdx.idx[0] > 0) {
            this.highlightTableElement(this.tableOperationConstants.rowHeader, [
              this.highlightedTableElementIdx.idx[0] - 1,
            ]);
          }
          break;
        default:
          break;
      }
    }
  }

  /*
  method to clear the highlight class of a cached table HTMLElement, and assign null to the variable
   */
  private clearHighlightedTableElement() {
    this.highlightedTableElementIdx = {
      tableElement: null,
      idx: [],
    };
  }

  public resetAfterFormSubmission(tableElement: TableOperationConstants): void {
    if (
      tableElement === this.tableOperationConstants.cell ||
      tableElement === this.tableOperationConstants.fieldWeight
    ) {
      this.tableDataUpdateFormControl.reset();
    } else {
      this.headerRenamingFormControl.reset();
    }
    this.modifiedTableElementIdx.tableElement = null;
    this.modifiedTableElementIdx.idx = [];
  }

  @ViewChild(MatInput) public headerRenamingInputComponent!: MatInput;
  @ViewChild(MatInput) public tableDataUpdateInputComponent!: MatInput;
  public displayResults: boolean = false;
  // formControl for the column header renaming input component
  public headerRenamingFormControl = new FormControl<string>("");
  public tableDataUpdateFormControl = new FormControl<number | null>(null, [
    Validators.max(10),
    Validators.min(1),
  ]);
  // * dictionary to indicate the table element that is currently being modified
  public modifiedTableElementIdx: {
    tableElement: TableOperationConstants | null;
    idx: number[];
  } = { tableElement: null, idx: [] };
  // * dictionary to indicate the table element that is currently being highlighted
  public highlightedTableElementIdx: {
    tableElement: TableOperationConstants | null;
    idx: number[];
  } = { tableElement: null, idx: [] };
  // * dictionary to indicate the table element that is currently being highlighted
  public cachedHighlightedTableElementIdx!: {
    tableElement: TableOperationConstants | null;
    idx: number[];
  };

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

    this.headerRenamingFormControl.valueChanges.subscribe((value) => {
      if (value) {
        if (
          this.modifiedTableElementIdx.tableElement ===
          TableOperationConstants.columnHeader
        ) {
          this.columnData[this.modifiedTableElementIdx.idx[0]].columnName =
            value;
        } else if (
          this.modifiedTableElementIdx.tableElement ===
          this.tableOperationConstants.rowHeader
        ) {
          this.tableData[this.modifiedTableElementIdx.idx[0]].fieldName = value;
        }
      }
    });

    this.tableDataUpdateFormControl.valueChanges.subscribe((value) => {
      if (value) {
        if (
          this.modifiedTableElementIdx.tableElement ===
            TableOperationConstants.cell &&
          Array.isArray(this.modifiedTableElementIdx.idx)
        ) {
          this.tableData[this.modifiedTableElementIdx.idx[0]].fieldValues[
            this.modifiedTableElementIdx.idx[1]
          ] = value;
        } else if (
          this.modifiedTableElementIdx.tableElement ===
          TableOperationConstants.fieldWeight
        ) {
          this.tableData[this.modifiedTableElementIdx.idx[0]].fieldWeight =
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
      this.columnData.push({ columnName: "Option 1", result: null });
      this.columnData.push({ columnName: "Option 2", result: null });
    }
    if (this.tableData.length === 0) {
      this.tableData.push({
        fieldName: "Criterion 1",
        fieldValues: [null, null],
        fieldWeight: null,
      });
    }
  }

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
  public trackByFn(index: number, item: any): number {
    return index;
  }

  public addCandidate(): void {
    this.columnData.push({ columnName: "new", result: null });
    this.tableData.forEach((tableData) => {
      tableData.fieldValues.push(null);
    });
    // * prompt user to rename the new column header immediately after creation
    this.modifyTableElement(TableOperationConstants.columnHeader, [
      this.columnData.length - 1,
    ]);
  }
  public addRow(): void {
    this.tableData.push({
      fieldName: "new",
      fieldValues: Array(this.columnData.length).fill(null),
      fieldWeight: null,
    });
    // * prompt user to rename the new option immediately after creation
    this.modifyTableElement(TableOperationConstants.rowHeader, [
      this.tableData.length - 1,
    ]);
  }

  /*
  method to update the value of the table element
  procedure: hidden table element, show input component
   */
  public modifyTableElement(
    tableElement: TableOperationConstants,
    idx: number[]
  ) {
    this.modifiedTableElementIdx = { tableElement, idx };
    // have to defer the action to the next loop otherwise the ViewChild will be undefined
    setTimeout(() => {
      this.headerRenamingInputComponent.focus();
    });
  }
  public inputFocusOutHandler(): void {
    this.submitForm();
  }
  // row drop method shifts the order of the tableData array around
  public rowDropMethod($event: CdkDragDrop<TableRowData[]>) {
    moveItemInArray(this.tableData, $event.previousIndex, $event.currentIndex);
  }

  public highlightTableElement(
    tableElement: TableOperationConstants,
    idx: number[]
  ): void {
    // this should be good enough to add the highlight class to the table element
    this.highlightedTableElementIdx = { tableElement, idx };
    // * cache the highlighted table element so that it can be reactivated
    this.cachedHighlightedTableElementIdx = this.highlightedTableElementIdx;
  }

  /*
    method to calculate the weighted sum of the tableData array
    time each cell by its weight, calculate the sum, and attach to each column's result property
   */
  public calculateResult(): void {
    // todo make this method more performant, loop through each cell instead of each column with a nested loop
    this.columnData.forEach((option, index) => {
      option.result = this.tableData.reduce((sum, row) => {
        if (row.fieldValues[index] !== null && row.fieldWeight) {
          const val: number = row.fieldValues[index] ?? 0;
          return sum + val * row.fieldWeight;
        } else return sum;
      }, 0);
    });
    this.displayResults = true;
  }

  private initiateTableTraversal() {
    if (this.cachedHighlightedTableElementIdx.tableElement !== null) {
      this.highlightTableElement(
        this.cachedHighlightedTableElementIdx.tableElement,
        this.cachedHighlightedTableElementIdx.idx
      );
    }
  }
}
