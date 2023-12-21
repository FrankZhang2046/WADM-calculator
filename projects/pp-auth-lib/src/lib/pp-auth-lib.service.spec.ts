import { TestBed } from '@angular/core/testing';

import { PpAuthLibService } from './pp-auth-lib.service';

describe('PpAuthLibService', () => {
  let service: PpAuthLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PpAuthLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
