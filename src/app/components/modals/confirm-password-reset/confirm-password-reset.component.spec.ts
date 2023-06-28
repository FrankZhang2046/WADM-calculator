import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ConfirmPasswordResetComponent } from "./confirm-password-reset.component";

describe("ComfirmPasswordResetComponent", () => {
  let component: ConfirmPasswordResetComponent;
  let fixture: ComponentFixture<ConfirmPasswordResetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConfirmPasswordResetComponent],
    });
    fixture = TestBed.createComponent(ConfirmPasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
