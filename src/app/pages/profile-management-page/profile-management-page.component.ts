import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import {
  ref,
  Storage,
  uploadBytes,
  uploadBytesResumable,
} from "@angular/fire/storage";
import { finalize, Observable } from "rxjs";
import { Select } from "@ngxs/store";
import { AppReduxStateModel } from "../../models/app-redux-state.model";
import { updateProfile, User } from "@angular/fire/auth";
import { ImageCroppedEvent, ImageCropperModule } from "ngx-image-cropper";
import { DomSanitizer } from "@angular/platform-browser";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { UploadProfileImageComponent } from "../../components/modals/upload-profile-image/upload-profile-image.component";

@Component({
  selector: "app-profile-management-page",
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./profile-management-page.component.html",
  styleUrls: ["./profile-management-page.component.scss"],
})
export class ProfileManagementPageComponent implements OnInit {
  @Select((state: AppReduxStateModel) => state.user.currentUser)
  currentUser$!: Observable<User>;
  public currentUserVal!: User;
  public userDisplayName = new FormControl<string>("");

  constructor(
    private storage: Storage,
    private sanitizer: DomSanitizer,
    private matDialog: MatDialog
  ) {}

  // showPreview(event: any) {
  //   if (event.target.files && event.target.files[0]) {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => (this.selectedImage = e.target.result);
  //     reader.readAsDataURL(event.target.files[0]);
  //     this.selectedImage = event.target.files[0];
  //   } else {
  //     this.selectedImage = null;
  //   }
  // }

  public ngOnInit(): void {
    this.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUserVal = user;
        this.userDisplayName.setValue(this.currentUserVal.displayName);
      }
    });
  }

  /**
   * method to update authenticated user's display name
   */
  public updateDisplayName() {
    if (
      this.userDisplayName.value &&
      this.userDisplayName.value !== this.currentUserVal.displayName
    ) {
      updateProfile(this.currentUserVal, {
        displayName: this.userDisplayName.value,
      }).then((result) => console.log(`display name update result: `, result));
    }
  }

  public uploadProfileImage() {
    this.matDialog.open(UploadProfileImageComponent, {
      width: "600px",
      height: "fit-content",
    });
  }
}
