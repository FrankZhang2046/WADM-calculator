import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { Auth, GoogleAuthProvider, signInWithPopup } from "@angular/fire/auth";
import { Router } from "@angular/router";

@Component({
  selector: "app-sign-in",
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.scss"],
})
export class SignInComponent {
  constructor(private auth: Auth, private router: Router) {}
  public signIn(signInMethod: string) {
    switch (signInMethod) {
      case "google":
        signInWithPopup(this.auth, new GoogleAuthProvider()).then((result) => {
          this.router.navigate(["/"]);
        });
        break;
      default:
        break;
    }
  }
}
