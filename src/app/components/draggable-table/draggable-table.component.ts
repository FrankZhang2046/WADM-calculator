import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  CdkDragEnd,
  CdkDragStart,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatSort } from '@angular/material/sort';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';

const ELEMENT_DATA: any[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-draggable-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, DragDropModule],
  templateUrl: './draggable-table.component.html',
  styleUrls: ['./draggable-table.component.scss'],
})
export class DraggableTableComponent {
  @ViewChild(MatTable) public table!: MatTable<any>;

  rowDragStartedHandler($event: CdkDragStart<any>, index: number) {
    console.log(`row dragStarted event, index is: `, index);
    this.previousRowIndex = index;
  }

  rowDropMethod($event: any, index: number) {
    console.log(`dropMethod event: `, index);
    if ($event && this.previousRowIndex !== undefined) {
      moveItemInArray(ELEMENT_DATA, this.previousRowIndex, index);
      console.log(ELEMENT_DATA);
      this.table.renderRows();
      this.previousRowIndex = undefined;
    }
  }

  columns: any[] = [
    { field: 'position' },
    { field: 'name' },
    { field: 'weight' },
    { field: 'symbol' },
  ];
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  @ViewChild(MatSort) sort!: MatSort;

  previousColumnIndex!: number | undefined;
  previousRowIndex!: number | undefined;

  ngOnInit() {
    this.setDisplayedColumns();
    this.dataSource.sort = this.sort;
  }

  setDisplayedColumns() {
    this.columns.forEach((column, index) => {
      column.index = index;
      this.displayedColumns[index] = column.field;
    });
  }

  dragStarted(event: CdkDragStart, index: number) {
    console.log(`dragStarted event: `, event, index);

    this.previousColumnIndex = index;
  }

  // dropListDropped(event: CdkDropList, index: number) {
  dropListDropped(event: any, index: number) {
    console.log(`event is:`, event);
    if (event && this.previousColumnIndex !== undefined) {
      moveItemInArray(this.columns, this.previousColumnIndex, index);
      this.setDisplayedColumns();
      this.previousColumnIndex = undefined;
    }
  }
}
