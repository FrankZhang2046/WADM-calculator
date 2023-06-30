import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CacheResultBeforeRedirectionComponent } from './cache-result-before-redirection.component';

describe('CacheResultBeforeRedirectionComponent', () => {
  let component: CacheResultBeforeRedirectionComponent;
  let fixture: ComponentFixture<CacheResultBeforeRedirectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CacheResultBeforeRedirectionComponent]
    });
    fixture = TestBed.createComponent(CacheResultBeforeRedirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
