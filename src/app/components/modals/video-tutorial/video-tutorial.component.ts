import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogRef } from "@angular/material/dialog";
import {
  doc,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from "@angular/fire/firestore";
import { AppReduxStateModel } from "../../../models/app-redux-state.model";
import { Select } from "@ngxs/store";
import { Observable } from "rxjs";
import { User } from "@angular/fire/auth";

@Component({
  selector: "app-video-tutorial",
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: "./video-tutorial.component.html",
  styleUrls: ["./video-tutorial.component.scss"],
})
export class VideoTutorialComponent {
  @Select((state: AppReduxStateModel) => state.user.currentUser)
  currentUser$!: Observable<User | null>;
  currentUserVal!: User | null;

  constructor(
    private matDialogRef: MatDialogRef<VideoTutorialComponent>,
    private firestore: Firestore
  ) {
    this.currentUser$.subscribe((user) => {
      this.currentUserVal = user;
    });
  }

  closeDialog() {
    this.matDialogRef.close();
  }

  public dismissPermanently() {
    const userCustomization = doc(
      this.firestore,
      `customization/${this.currentUserVal?.uid}`
    );
    getDoc(userCustomization).then((doc) => {
      if (doc.exists()) {
        updateDoc(userCustomization, { masterRace: "asian" })
          .then(() => console.log(`you won't show the tutorial again.`))
          .catch((error) => console.log(`customization error: `, error));
      } else {
        setDoc(userCustomization, { displayTutorial: false })
          .then(() => console.log(`you won't show the tutorial again.`))
          .catch((error) => console.log(`customization error: `, error));
      }
    });
  }
}
