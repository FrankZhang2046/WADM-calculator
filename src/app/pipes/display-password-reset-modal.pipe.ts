import { Pipe, PipeTransform } from "@angular/core";
import { User } from "@angular/fire/auth";

@Pipe({
  name: "displayPasswordResetModal",
  standalone: true,
})
export class DisplayPasswordResetModalPipe implements PipeTransform {
  transform(currentUser: User | null): boolean {
    if (currentUser) {
      return (
        currentUser.providerData &&
        currentUser.providerData[0].providerId === "password"
      );
    } else {
      return true;
    }
  }
}
