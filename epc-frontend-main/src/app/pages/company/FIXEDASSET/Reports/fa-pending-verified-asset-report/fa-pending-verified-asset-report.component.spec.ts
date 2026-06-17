import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaPendingVerifiedAssetReportComponent } from './fa-pending-verified-asset-report.component';

describe('FaPendingVerifiedAssetReportComponent', () => {
  let component: FaPendingVerifiedAssetReportComponent;
  let fixture: ComponentFixture<FaPendingVerifiedAssetReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaPendingVerifiedAssetReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaPendingVerifiedAssetReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
