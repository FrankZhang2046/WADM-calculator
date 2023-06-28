import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import {
  Form,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-comfirm-password-reset",
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./comfirm-password-reset.component.html",
  styleUrls: ["./comfirm-password-reset.component.scss"],
})
export class ComfirmPasswordResetComponent {
  constructor(
    private matDialogRef: MatDialogRef<ComfirmPasswordResetComponent>
  ) {}

  public emailForm: FormControl = new FormControl(
    "",
    Validators.compose([Validators.email, Validators.required])
  );

  public closeDialog() {
    this.matDialogRef.close();
  }

  public redirectToPasswordResetPage() {}
}
