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
    uploadBytesResumable(storageRef, this.dataURItoBlob(this.selectedImage), {
      contentType: "image/png",
    });
  }

  public dataURItoBlob(dataURI: any) {
    if (typeof dataURI !== "string") {
      throw new Error("Invalid argument: dataURI must be a string");
    }
    dataURI = dataURI.split(",");
    var type = dataURI[0].split(":")[1].split(";")[0],
      byteString = atob(dataURI[1]),
      byteStringLength = byteString.length,
      arrayBuffer = new ArrayBuffer(byteStringLength),
      intArray = new Uint8Array(arrayBuffer);
    for (var i = 0; i < byteStringLength; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([intArray], {
      type: type,
    });
  }
}
