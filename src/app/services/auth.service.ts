import { Injectable } from "@angular/core";
import {
  Auth,
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
    return signInWithEmailAndPassword(this.auth, email, password);
    //   .then(
    //   (userCredential) => {
    //     console.log(`credential: `, userCredential);
    //     return userCredential;
    //   }
    // );
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
}
