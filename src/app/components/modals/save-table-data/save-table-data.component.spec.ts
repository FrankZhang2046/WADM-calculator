import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveTableDataComponent } from './save-table-data.component';

describe('SaveTableDataComponent', () => {
  let component: SaveTableDataComponent;
  let fixture: ComponentFixture<SaveTableDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SaveTableDataComponent]
    });
    fixture = TestBed.createComponent(SaveTableDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
