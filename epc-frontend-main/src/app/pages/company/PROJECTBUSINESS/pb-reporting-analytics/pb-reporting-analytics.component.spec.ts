import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PbReportingAnalyticsComponent } from './pb-reporting-analytics.component';

describe('PbReportingAnalyticsComponent', () => {
  let component: PbReportingAnalyticsComponent;
  let fixture: ComponentFixture<PbReportingAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PbReportingAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PbReportingAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
