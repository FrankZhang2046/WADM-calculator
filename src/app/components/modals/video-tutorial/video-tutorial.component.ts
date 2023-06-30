import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-video-tutorial",
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: "./video-tutorial.component.html",
  styleUrls: ["./video-tutorial.component.scss"],
})
export class VideoTutorialComponent {
  constructor(private matDialogRef: MatDialogRef<VideoTutorialComponent>) {}

  closeDialog() {
    this.matDialogRef.close();
  }
}
