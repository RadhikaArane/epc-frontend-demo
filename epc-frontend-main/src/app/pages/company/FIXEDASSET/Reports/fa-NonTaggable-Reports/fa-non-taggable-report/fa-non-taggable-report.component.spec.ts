import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaNonTaggableReportComponent } from './fa-non-taggable-report.component';

describe('FaNonTaggableReportComponent', () => {
  let component: FaNonTaggableReportComponent;
  let fixture: ComponentFixture<FaNonTaggableReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaNonTaggableReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaNonTaggableReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
