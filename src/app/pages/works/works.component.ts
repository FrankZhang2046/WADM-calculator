import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Firestore, collection, onSnapshot } from "@angular/fire/firestore";
import { AuthStateModel } from "src/app/stores/states/auth.state";
import { TableStateModel } from "src/app/stores/states/table.state";
import { Observable } from "rxjs";
import { User } from "@angular/fire/auth";
import { Select } from "@ngxs/store";
import { MatTableModule } from "@angular/material/table";
import { PersistedTableDocument } from "src/app/models/table-row-data.model";

@Component({
  selector: "app-works",
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: "./works.component.html",
  styleUrls: ["./works.component.scss"],
})
export class WorksComponent implements OnInit {
  @Select(
    (state: { user: AuthStateModel; table: TableStateModel }) =>
      state.user.currentUser
  )
  public currentUser$!: Observable<User | null>;
  public dataSource!: PersistedTableDocument[];
  public currentUserValue!: User | null;
  constructor(private firestore: Firestore) {}
  public ngOnInit(): void {
    this.currentUser$.subscribe((user) => {
      this.currentUserValue = user;
      if (this.currentUserValue) {
        const userTableCollection = collection(
          this.firestore,
          `appData/tables/${this.currentUserValue.uid}`
        );
        onSnapshot(userTableCollection, (snapshot) => {
          this.dataSource = snapshot.docs.map(
            (doc) => doc.data() as PersistedTableDocument
          );
        });
      }
    });
  }
}
