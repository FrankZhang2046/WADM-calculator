import { Injectable } from "@angular/core";
import { PersistedTableDocument } from "../models/table-row-data.model";
import {
  Firestore,
  addDoc,
  collection,
  doc,
  serverTimestamp,
} from "@angular/fire/firestore";
import { Select, Store } from "@ngxs/store";
import { TableStateModel } from "../stores/states/table.state";
import { AuthStateModel } from "../stores/states/auth.state";
import { Observable, take } from "rxjs";
import { User } from "@angular/fire/auth";

@Injectable({
  providedIn: "root",
})
export class TableDataService {
  constructor(private firestore: Firestore, private store: Store) {}
  /* method that writes table data to db
    @param tableData: table data to be written to db
  */
  writeTableData(tableData: any): Promise<any> {
    const currentUser = this.store.select((state) => state.user.currentUser);
    tableData.createdAt = serverTimestamp();
    return new Promise((resolve, reject) => {
      currentUser.pipe(take(1)).subscribe((user) => {
        const tableCollection = collection(
          this.firestore,
          `appData/tables/${user?.uid}`
        );
        resolve(addDoc(tableCollection, tableData));
      });
    });
  }
}
