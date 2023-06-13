import { TestBed } from '@angular/core/testing';

import { TableTraversalService } from './table-traversal.service';

describe('TableTraversalService', () => {
  let service: TableTraversalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableTraversalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
