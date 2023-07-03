import {Injectable} from "@angular/core";
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
import {Store} from "@ngxs/store";
import {Observable, Subject, take} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TableDataService {
  public clearTableSubject: Subject<boolean> = new Subject();

  constructor(private firestore: Firestore, private store: Store) {
  }

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
        resolve(addDoc(tableCollection, {...tableData}));
      });
    });
  }

  public updateTableData(tableDataToUpdate: CachedPersistedTableDocument) {
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

  /*
  emit new value from the clearTableSubject to let table component know that it should clear the table
   */
  public clearTable(): void {
    this.clearTableSubject.next(true);
  }
}
