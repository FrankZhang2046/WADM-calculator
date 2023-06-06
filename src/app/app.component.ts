import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DraggableTableComponent } from './components/draggable-table/draggable-table.component';
import { CustomHtmlTableComponent } from './components/custom-html-table/custom-html-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    DraggableTableComponent,
    CustomHtmlTableComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // generate a list of self-help book titles
  public bookTitles: string[] = [
    'Think and Grow Rich',
    'Psycho Cybernetics',
    'The Power of Habit',
    'The 4 Hour Work Week',
    'The Lean Startup',
    'The Big Short',
    'The Road to React',
    'The Pragmatic Programmer',
  ];
}
