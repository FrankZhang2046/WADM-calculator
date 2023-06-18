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

@Component({
  selector: "app-save-table-data",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: "./save-table-data.component.html",
  styleUrls: ["./save-table-data.component.scss"],
})
export class SaveTableDataComponent implements OnInit {
  public tableInfoForm!: FormGroup<{
    tableName: FormControl<string | null>;
    tableNotes: FormControl<string | null>;
  }>;
  constructor(private formBuilder: FormBuilder) {}
  // * getter method that returns the formGroup's control
  public get form() {
    return this.tableInfoForm.controls;
  }

  ngOnInit(): void {
    /* create a formGroup with two fields
      tableName: string;
      tableNotes: string;
    */
    this.formBuilder.group({
      tableName: ["", Validators.required],
      tableNotes: [""],
    });
  }
  public onSubmit() {
    throw new Error("Method not implemented.");
  }
}
