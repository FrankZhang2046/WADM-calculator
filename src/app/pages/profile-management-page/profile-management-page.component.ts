import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { ref, Storage, uploadBytesResumable } from "@angular/fire/storage";
import { finalize, Observable } from "rxjs";
import { Select } from "@ngxs/store";
import { AppReduxStateModel } from "../../models/app-redux-state.model";
import { User } from "@angular/fire/auth";

@Component({
  selector: "app-profile-management-page",
  standalone: true,
  imports: [CommonModule, MatInputModule],
  templateUrl: "./profile-management-page.component.html",
  styleUrls: ["./profile-management-page.component.scss"],
})
export class ProfileManagementPageComponent implements OnInit {
  public selectedImage: any;
  @Select((state: AppReduxStateModel) => state.user.currentUser)
  currentUser$!: Observable<User>;
  public currentUserVal!: User;

  constructor(private storage: Storage) {}

  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => (this.selectedImage = e.target.result);
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    } else {
      this.selectedImage = null;
    }
  }

  public ngOnInit(): void {
    this.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUserVal = user;
      }
    });
  }

  onUpload() {
    const storageRef = ref(
      this.storage,
      `images/${this.currentUserVal.uid}/profile-image`
    );
    uploadBytesResumable(storageRef, this.selectedImage).then((snapshot) => {
      console.log(snapshot);
    });
  }
}
