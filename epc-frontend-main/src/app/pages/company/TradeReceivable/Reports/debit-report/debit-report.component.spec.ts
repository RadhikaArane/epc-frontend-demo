import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitReportComponent } from './debit-report.component';

describe('DebitReportComponent', () => {
  let component: DebitReportComponent;
  let fixture: ComponentFixture<DebitReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebitReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebitReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
