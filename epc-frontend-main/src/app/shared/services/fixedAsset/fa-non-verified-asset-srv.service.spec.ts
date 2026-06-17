import { TestBed } from '@angular/core/testing';

import { FaNonVerifiedAssetSrvService } from './fa-non-verified-asset-srv.service';

describe('FaNonVerifiedAssetSrvService', () => {
  let service: FaNonVerifiedAssetSrvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaNonVerifiedAssetSrvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
