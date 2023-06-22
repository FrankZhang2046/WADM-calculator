import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  Firestore,
  collection,
  onSnapshot,
  deleteDoc,
  doc,
} from "@angular/fire/firestore";
import { AuthStateModel } from "src/app/stores/states/auth.state";
import { TableStateModel } from "src/app/stores/states/table.state";
import { Observable } from "rxjs";
import { User } from "@angular/fire/auth";
import { Select, Store } from "@ngxs/store";
import { MatTableModule } from "@angular/material/table";
import {
  CachedPersistedTableDocument,
  PersistedTableDocument,
} from "src/app/models/table-row-data.model";
import { ActivatedRoute, Router } from "@angular/router";
import { TableActions } from "src/app/stores/actions/table.action";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatMenu, MatMenuModule } from "@angular/material/menu";

@Component({
  selector: "app-works",
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
  ],
  templateUrl: "./works.component.html",
  styleUrls: ["./works.component.scss"],
})
export class WorksComponent implements OnInit {
  @Select(
    (state: { user: AuthStateModel; table: TableStateModel }) =>
      state.user.currentUser
  )
  public currentUser$!: Observable<User | null>;
  public dataSource!: CachedPersistedTableDocument[];
  public currentUserValue!: User | null;
  public displayedColumns: string[] = [
    "tableName",
    "tableNotes",
    "actionControl",
  ];
  constructor(
    private store: Store,
    private firestore: Firestore,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  public ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      console.log(`params are: `, params);
    });
    this.currentUser$.subscribe((user) => {
      this.currentUserValue = user;
      if (this.currentUserValue) {
        const userTableCollection = collection(
          this.firestore,
          `appData/tables/${this.currentUserValue.uid}`
        );
        onSnapshot(userTableCollection, (snapshot) => {
          this.dataSource = snapshot.docs.map((doc) => {
            const returnDoc = doc.data();
            returnDoc["id"] = doc.id;
            return returnDoc as CachedPersistedTableDocument;
          });
        });
      }
    });
  }
  public loadTableData(tableRow: any) {
    console.log(`table row data is: `, tableRow);
    this.store.dispatch(
      new TableActions.RegisterRetrievedTableData(tableRow.tableData)
    );
    this.router.navigate(["/"]);
  }

  rowHoveredMethod($event: any) {
    console.log(`hovered row is: `, ($event.activated = true));
  }

  public deleteTable(myData: any) {
    const userTableCollection = collection(
      this.firestore,
      `appData/tables/${this.currentUserValue?.uid}`
    );
    const docRef = doc(userTableCollection, myData.id);
    deleteDoc(docRef).then((res) => console.log(`res is: `, res));
  }
}
