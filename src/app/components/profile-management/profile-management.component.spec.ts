import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileManagementComponent } from './profile-management.component';

describe('ProfileManagementComponent', () => {
  let component: ProfileManagementComponent;
  let fixture: ComponentFixture<ProfileManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProfileManagementComponent]
    });
    fixture = TestBed.createComponent(ProfileManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
