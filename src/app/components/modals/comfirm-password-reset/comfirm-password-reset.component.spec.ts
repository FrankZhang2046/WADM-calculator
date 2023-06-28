import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComfirmPasswordResetComponent } from './comfirm-password-reset.component';

describe('ComfirmPasswordResetComponent', () => {
  let component: ComfirmPasswordResetComponent;
  let fixture: ComponentFixture<ComfirmPasswordResetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ComfirmPasswordResetComponent]
    });
    fixture = TestBed.createComponent(ComfirmPasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
