import { connectAuthEmulator } from "@angular/fire/auth";
import { TableActions } from "./../../../stores/actions/table.action";
import { TableDataService } from "./../../../services/table-data.service";
import { Component, OnInit } from "@angular/core";
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
import { count, take, timer } from "rxjs";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-save-table-data",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
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
  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private matDialogRef: MatDialogRef<SaveTableDataComponent>
  ) {}
  // * getter method that returns the formGroup's control
  public get form() {
    return this.tableInfoForm.controls;
  }

  ngOnInit(): void {
    /* create a formGroup with two fields
      tableName: string;
      tableNotes: string;
    */
  }
  public onSubmit() {
    // make sure tableName is not null
    this.store
      .dispatch(
        new TableActions.WriteTableDataToDB({
          tableName: this.tableInfoForm.controls.tableName.value,
          tableNotes: this.tableInfoForm.controls.tableNotes.value,
        })
      )
      .subscribe((res) => {
        console.log(`saved to db: `, res);
        this.closeDialogTimer();
      });
  }

  public closeDialogTimer(): void {
    const countdown = 5;
    timer(0, 1000)
      .pipe(take(countdown + 1))
      .subscribe((val) => {
        this.dialogClose = countdown - val;
        if (this.dialogClose === 0) {
          this.matDialogRef.close();
        }
      });
  }
}
