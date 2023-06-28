import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import {
  Auth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithPopup,
  User,
} from "@angular/fire/auth";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { MatIconModule } from "@angular/material/icon";
import { AuthStateModel } from "../../stores/states/auth.state";
import { TableStateModel } from "../../stores/states/table.state";
import { Select } from "@ngxs/store";
import { Observable } from "rxjs";

@Component({
  selector: "app-sign-in",
  standalone: true,
  imports: [CommonModule, MatButtonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.scss"],
})
export class SignInComponent implements OnInit {
  @Output() signInStatus = new EventEmitter();
  @Select(
    (state: { user: AuthStateModel; table: TableStateModel }) =>
      state.user.currentUser
  )
  currentUser$!: Observable<User | null>;
  public signInForm!: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;
  public displaySignInForm!: boolean;
  private currentUserValue!: User | null;

  constructor(
    private auth: Auth,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.currentUser$.subscribe((value) => (this.currentUserValue = value));
  }

  public get form() {
    return this.signInForm.controls;
  }

  public ngOnInit(): void {
    // password: ["", Validators.minLength(6)],
    // a new password field, with 2 validators: required, and min length (6)
    this.signInForm = this.formBuilder.group({
      email: ["", Validators.compose([Validators.required, Validators.email])],
      password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });

    this.signInForm.controls.password.valueChanges.subscribe((value) =>
      console.log(`value is: `, value)
    );
  }

  public signIn(signInMethod: string) {
    switch (signInMethod) {
      case "google":
        signInWithPopup(this.auth, new GoogleAuthProvider())
          .then((result) => {
            this.signInStatus.emit({ status: "success", message: result });
          })
          .catch((error) =>
            this.signInStatus.emit({ status: "error", message: error.code })
          );
        break;
      case "email":
        this.displaySignInForm = true;
        break;
      default:
        break;
    }
  }

  public onSubmit(): void {
    // sign in the user with email and password
    this.authService
      .signInWithEmailAndPassword(
        this.form.email.value,
        this.form.password.value
      )
      .then((userCredential) => {
        this.signInStatus.emit({ status: "success", message: userCredential });
      })
      .catch((error) => {
        console.error(`error caught in sign in component`, error);
        const errorMsg = error;
        this.signInStatus.emit({ status: "error", message: error.code });
      });
  }

  public togglePasswordVisibility(
    inputComponent: HTMLInputElement,
    visible: boolean
  ) {
    if (visible) {
      inputComponent.type = "text";
    } else {
      inputComponent.type = "password";
    }
  }

  sendPasswordResetEmailToFirebase() {
    sendPasswordResetEmail(this.auth, this.currentUserValue?.email ?? "")
      .then((res) => {
        console.log(res);
      })
      .catch((error) =>
        this.signInStatus.emit({ status: "error", message: error.code })
      );
  }
}
