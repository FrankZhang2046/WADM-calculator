import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatLegacyDialogModule } from "@angular/material/legacy-dialog";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: "app-cache-result-before-redirection",
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTooltipModule],
  templateUrl: "./cache-result-before-redirection.component.html",
  styleUrls: ["./cache-result-before-redirection.component.scss"],
})
export class CacheResultBeforeRedirectionComponent {
  constructor(
    private matDialogRef: MatDialogRef<CacheResultBeforeRedirectionComponent>
  ) {}

  public closeDialog(valueAfterClosed: boolean): void {
    this.matDialogRef.close(valueAfterClosed);
  }
}
