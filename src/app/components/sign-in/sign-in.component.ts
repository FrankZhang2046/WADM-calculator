import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import {
  Auth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "@angular/fire/auth";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";

interface SignUpFormData {
  email: string;
  password: string;
}

@Component({
  selector: "app-sign-in",
  standalone: true,
  imports: [CommonModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.scss"],
})
export class SignInComponent implements OnInit {
  public signUpForm!: FormGroup;
  constructor(
    private auth: Auth,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}
  public get f() {
    return this.signUpForm.controls;
  }
  public displaySignInForm!: boolean;
  public ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", [Validators.required, Validators.minLength(6)]],
    });

    // listen for confirmPassword's valueChange event, if the value isn't the same as the password field's value, set 'passwordMismatch' error on confirmPassword
    this.signUpForm.get("confirmPassword")?.valueChanges.subscribe((value) => {
      if (value !== this.signUpForm.controls["password"].value) {
        this.signUpForm.controls["confirmPassword"].setErrors({
          passwordMismatch: true,
        });
        console.log("password mismatch", this.signUpForm);
      } else {
        this.signUpForm.controls["confirmPassword"].setErrors(null);
      }
    });
  }
  public signIn(signInMethod: string) {
    switch (signInMethod) {
      // todo this case is probably best handled by a service
      case "google":
        signInWithPopup(this.auth, new GoogleAuthProvider()).then((result) => {
          this.router.navigate(["/"]);
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
    this.authService.signUpWithEmailAndPassword(email, password);
  }
}
