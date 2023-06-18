import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTabsModule } from "@angular/material/tabs";
import { SignUpComponent } from "src/app/components/sign-up/sign-up.component";
import { SignInComponent } from "src/app/components/sign-in/sign-in.component";

@Component({
  selector: "app-log-in",
  standalone: true,
  imports: [CommonModule, MatTabsModule, SignUpComponent, SignInComponent],
  templateUrl: "./log-in.component.html",
  styleUrls: ["./log-in.component.scss"],
})
export class LogInComponent {}
