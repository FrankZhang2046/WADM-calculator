import DataLabelsPlugin from "chartjs-plugin-datalabels";
import { BaseChartDirective } from "ng2-charts";
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from "chart.js";
import { NgChartsModule } from "ng2-charts";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TableOperationConstants } from "src/app/models/enums";
import { MatInput, MatInputModule } from "@angular/material/input";
import { ConfirmDeletionComponent } from "../modals/confirm-deletion/confirm-deletion.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import {
  ColumnHeaderData,
  TableData,
  TableRowData,
} from "../../models/table-row-data.model";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { AssertArrayEqualityPipe } from "../../pipes/assert-array-equality.pipe";
import { Observable, timer } from "rxjs";
import { Select, Store } from "@ngxs/store";
import { TableActions } from "src/app/stores/actions/table.action";
import {
  Firestore,
  addDoc,
  collection,
  doc,
  onSnapshot,
  setDoc,
} from "@angular/fire/firestore";
import { TableStateModel } from "src/app/stores/states/table.state";
import { AuthStateModel } from "src/app/stores/states/auth.state";
import { User } from "@angular/fire/auth";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Router } from "@angular/router";
import { SaveTableDataComponent } from "../modals/save-table-data/save-table-data.component";

@Component({
  selector: "app-custom-html-table",
  standalone: true,
  imports: [
    MatTooltipModule,
    NgChartsModule,
    AssertArrayEqualityPipe,
    MatDialogModule,
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
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  public barChartOptions: ChartConfiguration["options"] = {
    indexAxis: "x",
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: "end",
        align: "end",
      },
    },
  };
  public barChartType: ChartType = "bar";
  public barChartPlugins = [DataLabelsPlugin];
  public barChartData!: ChartData<"bar">;
  public chartWidth!: string;
  public displayMessage: { status: string; message: string } = {
    status: "",
    message: "",
  };
  public highestResultColumnIdx: number[] = [];
  public currentUserVal!: User | null;
  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: {}[];
  }): void {
    console.log(event, active);
  }

  public tableOperationConstants = TableOperationConstants;
  public columnToDelete!: number | null;
  public rowToDelete!: number | null;
  public confirmDeletionModalOpened!: boolean;
  public get hasEitherColumnOrRowToDelete(): boolean {
    return (
      (this.columnToDelete !== null && this.columnToDelete !== undefined) ||
      (this.rowToDelete !== null && this.rowToDelete !== undefined)
    );
  }

  // * select the table state
  @Select(
    (state: { table: TableStateModel; user: AuthStateModel }) =>
      state.user.currentUser
  )
  currentUser$!: Observable<User | null>;
  @Select(
    (state: { table: TableStateModel; user: AuthStateModel }) =>
      state.table.retrievedTableData
  )
  retrievedTableData$!: Observable<TableData | null>;

  constructor(
    public matDialog: MatDialog,
    private store: Store,
    private firestore: Firestore,
    private router: Router
  ) {}

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
    if (this.confirmDeletionModalOpened || this.displayResults) {
      return;
    }
    console.log(`key pressed is:`, event.key);
    // switch statement to specify the procedure of different keystrokes:
    switch (event.key) {
      // if arrow right is pressed, console.log it
      case "ArrowRight":
        this.tableTraversal(event.key);
        break;
      case "ArrowLeft":
        if (
          this.highlightedTableElementIdx.tableElement ===
          this.tableOperationConstants.rowHeader
        ) {
          this.signalRowForDeletion(this.highlightedTableElementIdx.idx[0]);
        } else {
          this.tableTraversal(event.key);
        }
        break;
      case "ArrowDown":
        this.tableTraversal(event.key);
        break;
      case "ArrowUp":
        if (
          this.highlightedTableElementIdx.tableElement ===
          this.tableOperationConstants.columnHeader
        ) {
          this.signalColumnForDeletion(this.highlightedTableElementIdx.idx[0]);
        } else {
          this.tableTraversal(event.key);
        }
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
        if (this.displayResults) {
          return;
        }
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
      case "Backspace":
        if (
          !this.confirmDeletionModalOpened &&
          this.hasEitherColumnOrRowToDelete
        ) {
          const confirmDeletionDialogRef = this.matDialog.open(
            ConfirmDeletionComponent
          );

          confirmDeletionDialogRef
            .afterOpened()
            .subscribe((res) => (this.confirmDeletionModalOpened = true));

          confirmDeletionDialogRef.afterClosed().subscribe((res) => {
            if (res === true) {
              if (
                this.columnToDelete !== null &&
                this.columnToDelete !== undefined
              ) {
                this.deleteColumn(this.columnToDelete);
                this.columnToDelete = null;
              }
              if (this.rowToDelete !== null && this.rowToDelete !== undefined) {
                this.deleteRow(this.rowToDelete);
                this.rowToDelete = null;
              }
            }
            this.confirmDeletionModalOpened = false;
          });
        }
        break;
      default:
        break;
    }
  }
  public deleteColumn(columnToDelete: number) {
    // delete item at index columnToDelete from columnData
    this.columnData.splice(columnToDelete, 1);
    // delete item at index columnToDelete from each row of tableData
    this.tableData.forEach((row) => {
      row.fieldValues.splice(columnToDelete, 1);
    });
  }
  public deleteRow(rowToDelete: number) {
    // delete item at index rowToDelete from tableData
    this.tableData.splice(rowToDelete, 1);
  }

  /*
  method for traversing through table elements with the arrow keys
   */
  public tableTraversal(keystroke: string): void {
    // * abort table traversal if user is editing a field
    if (
      this.modifiedTableElementIdx.tableElement !== null ||
      this.displayResults
    ) {
      return;
    }
    if (this.highlightedTableElementIdx.tableElement === null) {
      this.initiateTableTraversal();
    }
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
        case "ArrowUp":
          this.highlightTableElement(this.tableOperationConstants.fieldWeight, [
            Math.max(this.highlightedTableElementIdx.idx[0] - 1, 0),
          ]);
          break;
        case "ArrowDown":
          this.highlightTableElement(this.tableOperationConstants.fieldWeight, [
            Math.min(
              this.highlightedTableElementIdx.idx[0] + 1,
              this.tableData.length - 1
            ),
          ]);
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
      this.updateTableData(this.tableDataUpdateFormControl.value);
      this.tableDataUpdateFormControl.reset();
    } else {
      this.updateTableHeader(this.headerRenamingFormControl.value);
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
    // validate that the value is a whole number
    Validators.pattern("^[1-9][0-9]?$|^10$"),
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
  public cachedHighlightedTableElementIdx: {
    tableElement: TableOperationConstants | null;
    idx: number[];
  } = { tableElement: null, idx: [] };

  /*
    event handler when the user drag and drops to change the order of column headers
  */
  public columnDropMethod($event: CdkDragDrop<string[]>) {
    this.clearHighlightedTableElement();
    // shift order around with the moveItemsInArray method
    moveItemInArray(this.columnData, $event.previousIndex, $event.currentIndex);
    this.swapColumnsForTableData($event.previousIndex, $event.currentIndex);
  }

  public ngOnInit(): void {
    this.currentUser$.subscribe((user) => (this.currentUserVal = user));
    this.retrievedTableData$.subscribe((tableData: any) =>
      console.log(`retrieved table data is: `, tableData)
    );
    const testCollection = collection(this.firestore, "test");
    onSnapshot(testCollection, (snapshot) => {
      snapshot.docs.forEach((doc) => console.log(doc.data()));
    });
    this.seedTable();
    // * valueChanges listener header renaming formControl
    this.headerRenamingFormControl.valueChanges.subscribe((value) => {
      this.updateTableHeader(value);
    });
  }

  private updateTableHeader(value: string | null) {
    if (value) {
      if (
        this.modifiedTableElementIdx.tableElement ===
        TableOperationConstants.columnHeader
      ) {
        this.columnData[this.modifiedTableElementIdx.idx[0]].columnName = value;
      } else if (
        this.modifiedTableElementIdx.tableElement ===
        this.tableOperationConstants.rowHeader
      ) {
        this.tableData[this.modifiedTableElementIdx.idx[0]].fieldName = value;
      }
    }
  }

  private updateTableData(value: number | null) {
    if (value && this.tableDataUpdateFormControl.valid) {
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
        this.tableData[this.modifiedTableElementIdx.idx[0]].fieldWeight = value;
      }
    }
  }

  /*
    when the table is empty, populate the table with some startup data
  */
  private seedTable() {
    if (this.columnData.length === 0) {
      this.columnData.push({ columnName: "Option 1", result: 0 });
      this.columnData.push({ columnName: "Option 2", result: 0 });
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
    this.clearHighlightedTableElement();
    this.columnData.push({ columnName: "new", result: 0 });
    this.tableData.forEach((tableData) => {
      tableData.fieldValues.push(null);
    });
    // * prompt user to rename the new column header immediately after creation
    this.modifyTableElement(TableOperationConstants.columnHeader, [
      this.columnData.length - 1,
    ]);
  }
  public addRow(): void {
    this.clearHighlightedTableElement();
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
    if (this.displayResults) {
      return;
    }
    this.clearHighlightedTableElement();
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
    this.clearHighlightedTableElement();
    moveItemInArray(this.tableData, $event.previousIndex, $event.currentIndex);
  }

  public highlightTableElement(
    tableElement: TableOperationConstants,
    idx: number[]
  ): void {
    if (this.displayResults) {
      return;
    }
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
    const formTableValidation = this.validateTableData();
    if (!formTableValidation) {
      this.dismissDisplayMessage(5000);
      return;
    }
    this.clearHighlightedTableElement();
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
    const tableEle = document.querySelector("table");
    const tableWidth = tableEle?.offsetWidth ? tableEle.offsetWidth : 0;
    this.chartWidth = (tableWidth - 48).toString() + "px";
    this.findBestOption();

    this.compileChartData();
    this.cacheLatestCalculatedTableData();
  }

  public dismissDisplayMessage(time: number) {
    timer(time).subscribe(() => {
      this.displayMessage = { status: "", message: "" };
    });
  }

  /*
  method to check if all the tableData's fieldValues and fieldWeights are valid
  */
  private validateTableData(): boolean {
    for (const row of this.tableData) {
      if (
        row.fieldValues.some((val) => val === null) ||
        row.fieldWeight === null
      ) {
        this.displayMessage = {
          status: "error",
          message: "Please fill in all the blank cells in the table.",
        };
        return false;
      }
    }
    return true;
  }

  private findBestOption() {
    // loop through the columnData array, find the column that has the highest result and cache it in an number[], if multiple values are tied, cache them all
    this.highestResultColumnIdx = [];
    let highestResult: number = 0;
    this.columnData.forEach((option, index) => {
      if (option.result > highestResult) {
        this.highestResultColumnIdx = [];
        this.highestResultColumnIdx.push(index);
        highestResult = option.result;
      } else if (option.result === highestResult) {
        this.highestResultColumnIdx.push(index);
      }
    });
    this.displayMessage = {
      status: "success",
      message:
        this.highestResultColumnIdx.length > 1
          ? `According to the data you entered, the best options are ${this.highestResultColumnIdx
              .map((idx) => this.columnData[idx].columnName)
              .join(", ")}`
          : `According to the data you entered, the best option is ${
              this.columnData[this.highestResultColumnIdx[0]].columnName
            }`,
    };
  }

  private initiateTableTraversal() {
    if (this.cachedHighlightedTableElementIdx.tableElement !== null) {
      this.highlightTableElement(
        this.cachedHighlightedTableElementIdx.tableElement,
        this.cachedHighlightedTableElementIdx.idx
      );
    }
  }
  public signalColumnForDeletion(columnToDelete: number): void {
    console.log(`signal col for deletion called`);
    if (this.columnToDelete === null || this.columnToDelete === undefined) {
      this.columnToDelete = columnToDelete;
      this.rowToDelete = null;
    } else {
      this.columnToDelete = null;
    }
  }

  private signalRowForDeletion(rowToDelete: number): void {
    if (this.rowToDelete === null || this.rowToDelete === undefined) {
      this.rowToDelete = rowToDelete;
      this.columnToDelete = null;
    } else {
      this.rowToDelete = null;
    }
  }

  private compileChartData(): void {
    const chartData: ChartData<"bar"> = {
      labels: [],
      datasets: [],
    };
    chartData.labels = this.columnData.map((col) => col.columnName);
    this.tableData.forEach((row) =>
      chartData.datasets.push({
        data: row.fieldValues.map(
          (val) => (val ?? 0) * (row.fieldWeight ? row.fieldWeight : 0)
        ),
        label: row.fieldName,
        stack: "a",
      })
    );

    this.barChartData = chartData;
  }
  /*
  persist latest calculated table data to the store
  */
  public cacheLatestCalculatedTableData() {
    this.store.dispatch(
      new TableActions.CacheCalculatedTableData({
        tableName: null,
        tableNotes: null,
        tableData: {
          columnData: this.columnData,
          tableRowData: this.tableData,
        },
      })
    );
  }

  public addDocToCollection() {
    const testCollection = collection(this.firestore, "test");
    addDoc(testCollection, {
      name: "I'm the eldest boi!",
    }).then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
    });
  }

  public resetHighlightedTableElement(): void {
    this.highlightedTableElementIdx = { tableElement: null, idx: [] };
  }
  public resetModifiedTableElement(): void {
    this.modifiedTableElementIdx = { tableElement: null, idx: [] };
  }
  public resetColumnData(): void {
    this.columnData = [];
  }
  public resetTableData(): void {
    this.tableData = [];
  }
  public resetTableElementDeletionVariables(): void {
    this.columnToDelete = null;
    this.rowToDelete = null;
  }
  /* 
  reset all the variables in table so the user can build a new form
  */
  public restartTableState(): void {
    this.resetHighlightedTableElement();
    this.resetModifiedTableElement();
    this.resetColumnData();
    this.resetTableData();
    this.dismissDisplayMessage(0);
    this.displayResults = false;
    this.seedTable();
    this.resetTableElementDeletionVariables();
  }
  /*
    method to either redirect user to log-in page if they are not logged in, or persist the table state to db
  */
  public saveTable(): void {
    if (!this.currentUserVal) {
      // todo need to display a message assuring the user their work has been saved
      this.router.navigate(["/log-in"]);
    } else {
      // todo open up a new modal asking user to enter table name and notes (optional)
      this.matDialog.open(SaveTableDataComponent);
      return;
    }
  }
}
