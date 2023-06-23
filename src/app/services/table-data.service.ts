import { Injectable } from "@angular/core";
import {
  CachedPersistedTableDocument,
  PersistedTableDocument,
} from "../models/table-row-data.model";
import {
  Firestore,
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
  getDoc,
  setDoc,
} from "@angular/fire/firestore";
import { Select, Store } from "@ngxs/store";
import { TableStateModel } from "../stores/states/table.state";
import { AuthStateModel } from "../stores/states/auth.state";
import { Observable, take } from "rxjs";
import { User } from "@angular/fire/auth";
import { update } from "@angular/fire/database";

@Injectable({
  providedIn: "root",
})
export class TableDataService {
  constructor(private firestore: Firestore, private store: Store) {}
  /* method that writes table data to db
    @param tableData: table data to be written to db
  */
  public writeTableData(tableData: any): Promise<any> {
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
  public updateTableData(tableDataToUpdate: CachedPersistedTableDocument) {
    console.log(`data to update: `, tableDataToUpdate);
    const docToUpdate = {...tableDataToUpdate};
    const currentUser = this.store.select((state) => state.user.currentUser);
    return new Promise((resolve, reject) => {
      currentUser.pipe(take(1)).subscribe((user) => {
        const docRef = doc(
          this.firestore,
          `appData/tables/${user?.uid}/${tableDataToUpdate.id}`
        );
        delete docToUpdate.id;
        resolve(updateDoc(docRef, docToUpdate));
      });
    });
  }
}
