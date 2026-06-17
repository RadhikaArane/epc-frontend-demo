import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrHistoricalReportsComponent } from './tr-historical-reports.component';

describe('TrHistoricalReportsComponent', () => {
  let component: TrHistoricalReportsComponent;
  let fixture: ComponentFixture<TrHistoricalReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrHistoricalReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrHistoricalReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
