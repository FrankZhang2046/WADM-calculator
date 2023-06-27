import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTabsModule } from "@angular/material/tabs";
import { SignUpComponent } from "src/app/components/sign-up/sign-up.component";
import { SignInComponent } from "src/app/components/sign-in/sign-in.component";
import { timer } from "rxjs";

@Component({
  selector: "app-log-in",
  standalone: true,
  imports: [CommonModule, MatTabsModule, SignUpComponent, SignInComponent],
  templateUrl: "./log-in.component.html",
  styleUrls: ["./log-in.component.scss"],
})
export class LogInComponent {
  public remainingTime: number = 5;
  public authMessage: { status: string; message: any } = {
    status: "",
    message: null,
  };

  public handleSignInStatusEvent($event: any) {
    this.authMessage = $event;
    this.clearAuthMessage();
  }

  public clearAuthMessage() {
    /*
    use the timer rx operator to clear the auth message after a few seconds
     */
    timer(5000).subscribe(() => {
      this.authMessage = { status: "", message: null };
    });
  }
}
