import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaManuelReportComponent } from './fa-manuel-report.component';

describe('FaManuelReportComponent', () => {
  let component: FaManuelReportComponent;
  let fixture: ComponentFixture<FaManuelReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaManuelReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaManuelReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
