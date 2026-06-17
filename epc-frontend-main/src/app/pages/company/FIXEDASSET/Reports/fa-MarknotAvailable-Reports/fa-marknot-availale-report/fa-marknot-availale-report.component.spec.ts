import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaMarknotAvailaleReportComponent } from './fa-marknot-availale-report.component';

describe('FaMarknotAvailaleReportComponent', () => {
  let component: FaMarknotAvailaleReportComponent;
  let fixture: ComponentFixture<FaMarknotAvailaleReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaMarknotAvailaleReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaMarknotAvailaleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
