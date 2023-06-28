import { Injectable } from "@angular/core";
import {
  Auth,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@angular/fire/auth";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private auth: Auth) {}

  public signInWithEmailAndPassword(
    email: string | null,
    password: string | null
  ): Promise<any> {
    if (!email || !password) {
      return new Promise((res, rej) => res(null));
    }
    return signInWithEmailAndPassword(this.auth, email, password).catch(
      (error) => {
        throw error;
      }
    );
  }

  public signUpWithEmailAndPassword(
    email: string | null,
    password: string | null
  ): Promise<any> {
    if (!email || !password) {
      return new Promise((res, rej) => res(null));
    }
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  public sendPasswordResetEmail(email: string | null): any {
    console.log(`trying to reset password for: `, email);
    sendPasswordResetEmail(this.auth, email ?? "")
      .then((res) => {
        console.log(res);
      })
      .catch((error) => console.log(`reset email error is: `, error));
  }
}
