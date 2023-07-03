import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogRef} from "@angular/material/dialog";
import {
  doc,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from "@angular/fire/firestore";
import {AppReduxStateModel} from "../../../models/app-redux-state.model";
import {Select, Store} from "@ngxs/store";
import {Observable} from "rxjs";
import {User} from "@angular/fire/auth";
import {ApplicationActions} from "../../../stores/actions/app.action";

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
    private firestore: Firestore,
    private store: Store
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
    getDoc(userCustomization)
      .then((doc) => {
        if (doc.exists()) {
          return updateDoc(userCustomization, {dismissTutorialPermanently: true})
        } else {
          return setDoc(userCustomization, {dismissTutorialPermanently: true})
        }
      }).then(res => {
      console.log(`customization updated, will not show tut again`, res)
      this.closeDialog()
    })
      .catch(error => console.log(`customization error: `, error));
  }

  public dismissForSession() {
    this.store.dispatch(new ApplicationActions.UpdateTutorialDismissedForSession(true));
    this.closeDialog();
  }
}
