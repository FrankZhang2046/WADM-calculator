import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDeletionModalComponent } from './table-deletion-modal.component';

describe('TableDeletionModalComponent', () => {
  let component: TableDeletionModalComponent;
  let fixture: ComponentFixture<TableDeletionModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TableDeletionModalComponent]
    });
    fixture = TestBed.createComponent(TableDeletionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
