import { Injectable } from "@angular/core";
import { Auth, createUserWithEmailAndPassword } from "@angular/fire/auth";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private auth: Auth) {}
  public signUpWithEmailAndPassword(
    email: string | null,
    password: string | null
  ) {
    if (!email || !password) {
      return;
    }
    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        console.log(`credential: `, userCredential);
      })
      .catch((error) => console.log(`error: `, error));
  }
}
