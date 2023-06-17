import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterOutlet } from "@angular/router";
import { DraggableTableComponent } from "./components/draggable-table/draggable-table.component";
import { CustomHtmlTableComponent } from "./components/custom-html-table/custom-html-table.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Auth, onAuthStateChanged } from "@angular/fire/auth";
import { Store } from "@ngxs/store";
import { AuthActions } from "./stores/actions/user.action";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    DraggableTableComponent,
    CustomHtmlTableComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private auth: Auth,
    private store: Store
  ) {}
  public redirectMethod(targetUrl: string) {
    this.router.navigateByUrl(targetUrl);
  }
  public ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      this.store.dispatch(new AuthActions.RegisterCurrentUser(user));
    });
  }
}
