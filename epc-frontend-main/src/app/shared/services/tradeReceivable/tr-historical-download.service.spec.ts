import { TestBed } from '@angular/core/testing';

import { TrHistoricalDownloadService } from './tr-historical-download.service';

describe('TrHistoricalDownloadService', () => {
  let service: TrHistoricalDownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrHistoricalDownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
