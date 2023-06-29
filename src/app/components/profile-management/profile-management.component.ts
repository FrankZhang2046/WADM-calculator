import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Select } from "@ngxs/store";
import { AppState } from "../../stores/states/app-state.state";
import { Observable } from "rxjs";
import { Auth, signOut, User } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { Input } from "@angular/core";
import { MatDrawer } from "@angular/material/sidenav";

@Component({
  selector: "app-profile-management",
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: "./profile-management.component.html",
  styleUrls: ["./profile-management.component.scss"],
})
export class ProfileManagementComponent {
  @Select((state: AppState) => state.user.currentUser)
  currentUser$!: Observable<User | null>;
  public currentUserVal!: User | null;
  @Input() public profileDrawerRef!: MatDrawer;
  @Input() public navDrawerRef!: MatDrawer;

  constructor(private router: Router, private auth: Auth) {
    this.currentUser$.subscribe((user) => {
      this.currentUserVal = user;
    });
  }

  public logOut() {
    signOut(this.auth).then(() => {
      this.profileDrawerRef.close();
      this.navDrawerRef.close();
    });
  }

  public redirectMethod(targetUrl: string) {
    this.router.navigateByUrl(targetUrl);
  }
}
