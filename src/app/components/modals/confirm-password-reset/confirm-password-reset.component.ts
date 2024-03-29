import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import {
  Form,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { Select } from "@ngxs/store";
import { Observable } from "rxjs";
import { AppReduxStateModel } from "../../../models/app-redux-state.model";
import { User } from "@angular/fire/auth";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-confirm-password-reset",
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: "./confirm-password-reset.component.html",
  styleUrls: ["./confirm-password-reset.component.scss"],
})
export class ConfirmPasswordResetComponent implements OnInit {
  @Select((state: AppReduxStateModel) => state.user.currentUser)
  currentUser$!: Observable<User | null>;
  public currentUserValue!: User | null;

  constructor(
    private matDialogRef: MatDialogRef<ConfirmPasswordResetComponent>,
    private authService: AuthService
  ) {
    this.currentUser$.subscribe((value) => (this.currentUserValue = value));
  }

  public emailForm: FormControl = new FormControl(
    "",
    Validators.compose([Validators.email, Validators.required])
  );

  public ngOnInit() {
    if (this.currentUserValue) {
      this.emailForm.setValue(this.currentUserValue.email);
    }
  }

  public closeDialog(dialogCloseVal: any): void {
    this.matDialogRef.close(dialogCloseVal);
  }

  public redirectToPasswordResetPage() {
    this.authService
      .sendPasswordResetEmail(this.emailForm.value)
      .then(() => this.closeDialog(true))
      .catch((error) => this.closeDialog(error));
  }
}
