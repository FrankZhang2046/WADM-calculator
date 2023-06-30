import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { tutorialText } from "../../models/tutorial-text.model";

@Component({
  selector: "app-tutorial",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./tutorial.component.html",
  styleUrls: ["./tutorial.component.scss"],
})
export class TutorialComponent {
  public tutorialText = tutorialText;
}
