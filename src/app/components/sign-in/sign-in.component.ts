import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import {
  Auth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "@angular/fire/auth";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: "app-sign-in",
  standalone: true,
  imports: [CommonModule, MatButtonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.scss"],
})
export class SignInComponent implements OnInit {
  public signInForm!: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;
  public displaySignInForm!: boolean;

  constructor(
    private auth: Auth,
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
  }
  public get form() {
    return this.signInForm.controls;
  }
  public ngOnInit(): void {
    this.signInForm = this.formBuilder.group({
      email: ["", Validators.required, Validators.email],
      password: ["", Validators.required, Validators.minLength(6)],
    });
  }
  public signIn(signInMethod: string) {
    switch (signInMethod) {
      case "google":
        signInWithPopup(this.auth, new GoogleAuthProvider());
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
    this.authService.signInWithEmailAndPassword(
      this.form.email.value,
      this.form.password.value
    );
  }
}
