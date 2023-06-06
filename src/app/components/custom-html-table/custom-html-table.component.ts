import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-custom-html-table',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatButtonModule],
  templateUrl: './custom-html-table.component.html',
  styleUrls: ['./custom-html-table.component.scss'],
})
export class CustomHtmlTableComponent {
  public columnData = ['criteria', 'weight', 'pizza', 'food box'];
  public tableData = [
    {
      fieldName: 'Taste',
      fieldValues: [10, 8, 6],
    },
    {
      fieldName: 'Healthiness',
      fieldValues: [9, 6, 7],
    },
    {
      fieldName: 'Cost',
      fieldValues: [10, 7, 9],
    },
  ];
}
