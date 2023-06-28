import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTabsModule } from "@angular/material/tabs";
import { SignUpComponent } from "src/app/components/sign-up/sign-up.component";
import { SignInComponent } from "src/app/components/sign-in/sign-in.component";
import { interval, take, timer } from "rxjs";
import { Router } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-log-in",
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    SignUpComponent,
    SignInComponent,
    MatButtonModule,
  ],
  templateUrl: "./log-in.component.html",
  styleUrls: ["./log-in.component.scss"],
})
export class LogInComponent {
  constructor(private router: Router) {}

  public remainingTime!: number;
  public authMessage: { status: string; message: any } = {
    status: "",
    message: null,
  };

  /*
    handle the sign in status event from the sign in component
   */
  public handleAuthStatusEvent($event: any) {
    this.authMessage = $event;
    console.log(`auth event is: `, this.authMessage);
    // this.clearAuthMessage();
  }

  /*
  use the timer rx operator to clear the auth message after a few seconds
   */
  public clearAuthMessage() {
    timer(0, 1000)
      .pipe(take(6))
      .subscribe((val: number) => {
        if (this.authMessage.status === "success") {
          console.log(val);
          this.remainingTime = 5 - val;
          if (this.remainingTime === 0) {
            this.navigateMethod();
          }
        } else {
          this.authMessage = { status: "", message: null };
        }
      });
  }

  protected readonly navigator = navigator;

  public navigateMethod() {
    this.router.navigate(["/"]);
  }
}
