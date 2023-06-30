import { MatMenuModule } from "@angular/material/menu";
import { TableStateModel } from "./stores/states/table.state";
import { AuthStateModel } from "./stores/states/auth.state";
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
import { ApplicationActions } from "./stores/actions/app.action";
import {
  ApplicationState,
  ApplicationStateModel,
} from "./stores/states/app.state";
import { AppReduxStateModel } from "./models/app-redux-state.model";

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

  constructor(
    private router: Router,
    private auth: Auth,
    private store: Store,
    private iconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
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
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserVal = user;
      this.store.dispatch(new AuthActions.RegisterCurrentUser(user));
      // todo clean up this code, redirection should not be handled here
      if (user) {
        if (!this.router.url.includes("works")) {
          // this.redirectMethod("/");
        }
      }
    });
  }

  protected readonly user = user;

  public goToTutorial() {
    this.store.dispatch(
      new ApplicationActions.UpdateApplicationState("tutorial")
    );
  }
}
