import { TestBed } from '@angular/core/testing';

import { FaVerifiedAssetsService } from './fa-verified-assets.service';

describe('FaVerifiedAssetsService', () => {
  let service: FaVerifiedAssetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaVerifiedAssetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
