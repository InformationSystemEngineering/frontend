import { TestBed } from '@angular/core/testing';

import { FairService } from './fair.service';

describe('FairService', () => {
  let service: FairService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FairService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
