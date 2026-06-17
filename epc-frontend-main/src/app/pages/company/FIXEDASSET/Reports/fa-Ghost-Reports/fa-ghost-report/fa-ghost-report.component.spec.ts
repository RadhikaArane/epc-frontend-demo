import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaGhostReportComponent } from './fa-ghost-report.component';

describe('FaGhostReportComponent', () => {
  let component: FaGhostReportComponent;
  let fixture: ComponentFixture<FaGhostReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaGhostReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaGhostReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
