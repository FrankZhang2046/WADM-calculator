import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import {
  Auth,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithPopup,
} from "@angular/fire/auth";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { MatIconModule } from "@angular/material/icon";
import { AuthStatus } from "../modals/auth-status.model";
import { environment } from "../../../environments/environment";

interface SignUpFormData {
  email: string;
  password: string;
}

@Component({
  selector: "app-sign-up",
  standalone: true,
  imports: [CommonModule, MatButtonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"],
})
export class SignUpComponent implements OnInit {
  @Output() signUpStatus: EventEmitter<AuthStatus> = new EventEmitter();
  public signUpForm!: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
  }>;

  constructor(
    private auth: Auth,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}

  public get f() {
    return this.signUpForm.controls;
  }

  public displaySignInForm: boolean = false;

  public ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      email: ["", Validators.compose([Validators.required, Validators.email])],
      password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
      confirmPassword: [
        "",
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });

    // listen for confirmPassword's valueChange event, if the value isn't the same as the password field's value, set 'passwordMismatch' error on confirmPassword
    this.signUpForm.get("confirmPassword")?.valueChanges.subscribe((value) => {
      if (value !== this.signUpForm.controls["password"].value) {
        this.signUpForm.controls["confirmPassword"].setErrors({
          passwordMismatch: true,
        });
      } else {
        this.signUpForm.controls["confirmPassword"].setErrors(null);
      }
    });
  }

  public signUp(signInMethod: string) {
    switch (signInMethod) {
      // todo this case is probably best handled by a service
      case "google":
        signInWithPopup(this.auth, new GoogleAuthProvider())
          .then((userCred) => {
            this.signUpStatus.emit({ status: "success", message: "logged in" });
          })
          .catch((error) => {
            console.log(`sign up problem: `, error);
            this.signUpStatus.emit({ status: "error", message: error.code });
          });
        break;
      case "email":
        this.displayEmailSignInForm();
        break;
      default:
        break;
    }
  }

  private displayEmailSignInForm() {
    this.displaySignInForm = true;
  }

  public onSubmit() {
    // Check if the form is valid
    if (this.signUpForm.invalid) {
      return;
    }

    // Get the user input values
    const email = this.f["email"].value;
    const password = this.f["password"].value;

    // TODO: Implement the sign-up logic using Firebase or your preferred authentication service
    this.authService
      .signUpWithEmailAndPassword(email, password)
      .then((res) => {
        this.signUpStatus.emit({ status: "success", message: "logged in" });
        const actionCodeSettings = {
          url: environment.production
            ? "https://wadm-calculator.web.app/works"
            : "http://localhost:4200",
          handleCodeInApp: true,
        };
        sendEmailVerification(res.user, actionCodeSettings);
      })
      .catch((err) =>
        this.signUpStatus.emit({ status: "error", message: err.code })
      );
  }

  /*
  method to toggle target password input component's type between password and string
   */
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
}
