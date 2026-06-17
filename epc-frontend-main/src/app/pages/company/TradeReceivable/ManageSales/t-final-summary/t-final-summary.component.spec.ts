import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TFinalSummaryComponent } from './t-final-summary.component';

describe('TFinalSummaryComponent', () => {
  let component: TFinalSummaryComponent;
  let fixture: ComponentFixture<TFinalSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TFinalSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TFinalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
