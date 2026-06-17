import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaExcelReportsComponent } from './fa-excel-reports.component';

describe('FaExcelReportsComponent', () => {
  let component: FaExcelReportsComponent;
  let fixture: ComponentFixture<FaExcelReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaExcelReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaExcelReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
