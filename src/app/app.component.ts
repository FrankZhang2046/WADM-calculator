import { MatMenuModule } from "@angular/material/menu";
import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterOutlet } from "@angular/router";
import { DraggableTableComponent } from "./components/draggable-table/draggable-table.component";
import { CustomHtmlTableComponent } from "./components/custom-html-table/custom-html-table.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import {
  Auth,
  User,
  onAuthStateChanged,
  signOut,
  user,
} from "@angular/fire/auth";
import { Select, Store } from "@ngxs/store";
import { AuthActions } from "./stores/actions/user.action";
import { Observable } from "rxjs";
import { MatDrawer, MatSidenavModule } from "@angular/material/sidenav";
import { environment } from "../environments/environment";
import { DomSanitizer } from "@angular/platform-browser";
import { ProfileManagementComponent } from "./components/profile-management/profile-management.component";
import { TutorialComponent } from "./components/tutorial/tutorial.component";
import { AppReduxStateModel } from "./models/app-redux-state.model";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { VideoTutorialComponent } from "./components/modals/video-tutorial/video-tutorial.component";
import { collection, doc, Firestore, getDoc } from "@angular/fire/firestore";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    MatMenuModule,
    MatTooltipModule,
    CommonModule,
    RouterOutlet,
    DraggableTableComponent,
    CustomHtmlTableComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    ProfileManagementComponent,
    TutorialComponent,
    MatDialogModule,
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  @Select((state: AppReduxStateModel) => state.user.currentUser)
  public currentUser$!: Observable<User | null>;
  public currentUserVal!: User | null;
  @Select((state: AppReduxStateModel) => state.application.appState)
  applicationState$!: Observable<"tutorial" | "work" | null>;
  public appStateVal!: "tutorial" | "work" | null;

  constructor(
    private firestore: Firestore,
    private router: Router,
    private auth: Auth,
    private store: Store,
    private iconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private matDialog: MatDialog
  ) {
    this.iconRegistry.addSvgIcon(
      "google-icon",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "../assets/icons/google-icon.svg"
      )
    );
  }

  public redirectMethod(targetUrl: string) {
    this.router.navigateByUrl(targetUrl);
  }

  public ngOnInit(): void {
    this.applicationState$.subscribe(
      (appState) => (this.appStateVal = appState)
    );
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserVal = user;
      this.store.dispatch(new AuthActions.RegisterCurrentUser(user));
      // todo clean up this code, redirection should not be handled here
      if (user) {
        const userCustomization = doc(
          this.firestore,
          `customization/${user.uid}`
        );
        getDoc(userCustomization)
          .then((doc) => console.log(`customization: `, doc.data()))
          .catch((error) => console.log(`customization error: `, error));
      }
    });
  }

  protected readonly user = user;

  public goToTutorial() {
    this.matDialog.open(VideoTutorialComponent);
    // this.store.dispatch(
    //   new ApplicationActions.UpdateApplicationState("tutorial")
    // );
  }

  public toggleProfileDrawer(profileManagementDrawer: MatDrawer): void {
    console.log(profileManagementDrawer);
    profileManagementDrawer.toggle();
    if (this.appStateVal !== "tutorial") {
      profileManagementDrawer.close();
    }
  }
}
