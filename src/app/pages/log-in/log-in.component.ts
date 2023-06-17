import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTabsModule } from "@angular/material/tabs";

@Component({
  selector: "app-log-in",
  standalone: true,
  imports: [CommonModule, MatTabsModule],
  templateUrl: "./log-in.component.html",
  styleUrls: ["./log-in.component.scss"],
})
export class LogInComponent {}
