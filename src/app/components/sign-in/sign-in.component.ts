import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import {
  Auth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "@angular/fire/auth";

@Component({
  selector: "app-sign-in",
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.scss"],
})
export class SignInComponent {
  constructor(private auth: Auth) {}
  public signIn(signInMethod: string) {
    switch (signInMethod) {
      case "google":
        signInWithPopup(this.auth, new GoogleAuthProvider());
        break;
      case "email":
        signInWithEmailAndPassword(this.auth, "XXXXXXXXXXXXX", "test");
        break;
      default:
        break;
    }
  }
}
