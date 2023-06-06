import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-custom-html-table',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatButtonModule, DragDropModule],
  templateUrl: './custom-html-table.component.html',
  styleUrls: ['./custom-html-table.component.scss'],
})
export class CustomHtmlTableComponent {
  testMethod($event: any) {
    // shift order around with the moveItemsInArray method
    moveItemInArray(this.columnData, $event.previousIndex, $event.currentIndex);

    console.log($event);
  }
  public previousColIndex!: number | undefined;
  dragStartedMethod(index: number) {
    this.previousColIndex = index;
  }
  columnDroppedMethod(index: number) {
    if (this.previousColIndex) {
      moveItemInArray(this.columnData, this.previousColIndex, index);
      console.log(`updated array: `, this.columnData);
      this.previousColIndex = undefined;
    }
  }
  public columnData = ['weight', 'one', 'two', 'three'];
  public tableData = [
    {
      fieldName: 'Taste',
      fieldValues: [10, 8, 6, 4],
    },
    {
      fieldName: 'Healthiness',
      fieldValues: [9, 6, 7, 4],
    },
    {
      fieldName: 'Cost',
      fieldValues: [10, 7, 9, 4],
    },
  ];
  public resultsData: number[] = [];
}
