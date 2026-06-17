import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrPmComparisonComponent } from './tr-pm-comparison.component';

describe('TrPmComparisonComponent', () => {
  let component: TrPmComparisonComponent;
  let fixture: ComponentFixture<TrPmComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrPmComparisonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrPmComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
