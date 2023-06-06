import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomHtmlTableComponent } from './custom-html-table.component';

describe('CustomHtmlTableComponent', () => {
  let component: CustomHtmlTableComponent;
  let fixture: ComponentFixture<CustomHtmlTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CustomHtmlTableComponent]
    });
    fixture = TestBed.createComponent(CustomHtmlTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
