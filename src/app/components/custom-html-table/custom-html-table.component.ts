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
    { taste: [{ weight: 10 }, { pizza: 8 }, { 'food box': 6 }] },
    { healthiness: [{ weight: 8 }, { pizza: 6 }, { 'food box': 9 }] },
    { cost: [{ weight: 6 }, { pizza: 7 }, { 'food box': 10 }] },
  ];
}
