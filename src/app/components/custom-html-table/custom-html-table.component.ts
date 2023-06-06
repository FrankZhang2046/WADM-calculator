import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-html-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-html-table.component.html',
  styleUrls: ['./custom-html-table.component.scss'],
})
export class CustomHtmlTableComponent {
  public sampleData = [
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
