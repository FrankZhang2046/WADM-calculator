import { Component, HostListener } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-confirm-deletion",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./confirm-deletion.component.html",
  styleUrls: ["./confirm-deletion.component.scss"],
})
export class ConfirmDeletionComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDeletionComponent>) {}
  @HostListener("window:keydown", ["$event"])
  public keyEvent(event: KeyboardEvent) {
    switch (event.key) {
      case "y":
        this.dialogRef.close(true);
        break;
      case "n":
        this.dialogRef.close(false);
        break;
      case "Escape":
        this.dialogRef.close(false);
        break;
      default:
        break;
    }
  }

  public closeDialog(confirmDeletion: boolean) {
    this.dialogRef.close(confirmDeletion);
  }
}
