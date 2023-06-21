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
import { MatIconModule } from "@angular/material/icon";
import { Auth, User, onAuthStateChanged, signOut } from "@angular/fire/auth";
import { Select, Store } from "@ngxs/store";
import { AuthActions } from "./stores/actions/user.action";
import { Observable } from "rxjs";
import { MatDrawer, MatSidenavModule } from "@angular/material/sidenav";

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
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  @Select(
    (state: { user: AuthStateModel; table: TableStateModel }) =>
      state.user.currentUser
  )
  currentUser$!: Observable<User | null>;
  constructor(
    private router: Router,
    private auth: Auth,
    private store: Store
  ) {}
  public redirectMethod(targetUrl: string) {
    this.router.navigateByUrl(targetUrl);
  }
  public ngOnInit(): void {
    this.currentUser$.subscribe((user) => {
      console.log(`in app component: `, user);
    });

    onAuthStateChanged(this.auth, (user) => {
      this.store.dispatch(new AuthActions.RegisterCurrentUser(user));
      if (user) {
        if (!this.router.url.includes("works")) {
          this.redirectMethod("/");
        }
      }
    });
  }
  public logOut() {
    signOut(this.auth);
  }
}
