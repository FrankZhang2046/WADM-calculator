import { TableActions } from "./../../../stores/actions/table.action";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { Component, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { Store } from "@ngxs/store";
import { Subscription, take, timer } from "rxjs";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CachedPersistedTableDocument } from "../../../models/table-row-data.model";

@Component({
  selector: "app-save-table-data",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: "./save-table-data.component.html",
  styleUrls: ["./save-table-data.component.scss"],
})
export class SaveTableDataComponent implements OnInit {
  public tableInfoForm: FormGroup<{
    tableName: FormControl<string | null>;
    tableNotes: FormControl<string | null>;
  }> = this.formBuilder.group({
    tableName: ["", Validators.required],
    tableNotes: [""],
  });
  public dialogClose!: number;
  private cachedTableData!: CachedPersistedTableDocument;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private store: Store,
    private matDialogRef: MatDialogRef<SaveTableDataComponent>,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}
  // * getter method that returns the formGroup's control
  public get form() {
    return this.tableInfoForm.controls;
  }
  public timerObservable!: Subscription;

  ngOnInit(): void {
    if (this.data) {
      console.log(`my data is: `, this.data);
      this.cachedTableData = this.data;
      console.log(`my cached data is: `, this.cachedTableData);
      this.form.tableName.setValue(this.data.tableName);
      this.form.tableNotes.setValue(this.data.tableNotes);
    }
  }
  public onSubmit() {
    // make sure tableName is not null
    if (this.data) {
      console.log(`on submit, my data is: `, this.data);
      this.cachedTableData.tableName = this.form.tableName.value ?? "";
      this.cachedTableData.tableNotes = this.form.tableNotes.value ?? "";
      console.log(`about to update`, this.cachedTableData);
      this.store
        .dispatch(new TableActions.UpdateTableData(this.cachedTableData))
        .subscribe(() => this.closeDialog());
    } else {
      this.store
        .dispatch(
          new TableActions.WriteTableDataToDB({
            tableName: this.tableInfoForm.controls.tableName.value,
            tableNotes: this.tableInfoForm.controls.tableNotes.value,
          })
        )
        .subscribe((res) => {
          // * display success message and close dialog
          this.closeDialogTimer();
        });
    }
  }
  public closeDialog(displaySnackbar: boolean = true): void {
    this.matDialogRef.close();
    if (this.timerObservable) {
      this.timerObservable.unsubscribe();
    }
    if (!this.data && !displaySnackbar) {
      this.displaySnackBar();
    }
  }

  public displaySnackBar(): void {
    const snackBarRef = this.snackBar.open(
      "Your work has been saved.",
      "View Table",
      {
        horizontalPosition: "center",
        verticalPosition: "top",
        duration: 5000,
      }
    );

    snackBarRef.onAction().subscribe(() => {
      this.router.navigate(["/works"]);
      snackBarRef.dismiss();
    });
  }

  public closeDialogTimer(): void {
    const countdown = 5;
    this.timerObservable = timer(0, 1000)
      .pipe(take(countdown + 1))
      .subscribe((val) => {
        this.dialogClose = countdown - val;
        if (this.dialogClose === 0) {
          this.closeDialog();
          this.displaySnackBar();
        }
      });
  }
}
