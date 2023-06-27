import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-table-deletion-modal",
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: "./table-deletion-modal.component.html",
  styleUrls: ["./table-deletion-modal.component.scss"],
})
export class TableDeletionModalComponent {
  constructor(
    private matDialogRef: MatDialogRef<TableDeletionModalComponent>
  ) {}

  public onCancel(): void {
    this.matDialogRef.close();
  }

  public onConfirm(): void {
    this.matDialogRef.close(true);
  }
}
