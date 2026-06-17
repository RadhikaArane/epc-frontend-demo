import { TestBed } from '@angular/core/testing';

import { TrLogReportService } from './tr-log-report.service';

describe('TrLogReportService', () => {
  let service: TrLogReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrLogReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
