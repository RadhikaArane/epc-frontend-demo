import { TestBed } from '@angular/core/testing';

import { TrStageMasterService } from './tr-stage-master.service';

describe('TrStageMasterService', () => {
  let service: TrStageMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrStageMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
