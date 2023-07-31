import { Component, SecurityContext } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ImageCroppedEvent, ImageCropperModule } from "ngx-image-cropper";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { MatButtonModule } from "@angular/material/button";
import { ref, Storage, uploadBytesResumable } from "@angular/fire/storage";
import { Select } from "@ngxs/store";
import { AppReduxStateModel } from "../../../models/app-redux-state.model";
import { Observable } from "rxjs";
import { updateProfile, User } from "@angular/fire/auth";
import { MatDialogRef } from "@angular/material/dialog";
import { getDownloadURL } from "@angular/fire/storage";

@Component({
  selector: "app-upload-profile-image",
  standalone: true,
  imports: [CommonModule, ImageCropperModule, MatButtonModule],
  templateUrl: "./upload-profile-image.component.html",
  styleUrls: ["./upload-profile-image.component.scss"],
})
export class UploadProfileImageComponent {
  @Select((state: AppReduxStateModel) => state.user.currentUser)
  currentUser$!: Observable<User>;
  public currentUserVal!: User;
  public selectedImage: any;
  imageChangedEvent: any = "";
  croppedImage: any = "";
  croppedImageContentType!: string;

  constructor(
    private sanitizer: DomSanitizer,
    private storage: Storage,
    private matDialogRef: MatDialogRef<UploadProfileImageComponent>
  ) {
    this.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUserVal = user;
      }
    });
  }

  public async onUpload() {
    const storageRef = ref(
      this.storage,
      `images/${this.currentUserVal.uid}/profile-image`
    );

    const response = await fetch(this.croppedImage);
    const blobImage = await response.blob();

    uploadBytesResumable(storageRef, blobImage, {
      contentType: this.croppedImageContentType,
    })
      .then((res) => {
        console.log(`res is: `, res);
        return getDownloadURL(storageRef);
      })
      .then((url) => {
        console.log(`download url is: `, url);
        return updateProfile(this.currentUserVal, { photoURL: url as string });
      })
      .then((res) => {
        this.matDialogRef.close();
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

  imageCropped($event: ImageCroppedEvent) {
    this.croppedImage = $event.objectUrl!;
    this.croppedImageContentType = $event.blob!.type;
  }

  imageLoaded() {}

  cropperReady() {}

  loadImageFailed() {}

  fileChangeEvent($event: Event) {
    this.imageChangedEvent = $event;
  }
}
