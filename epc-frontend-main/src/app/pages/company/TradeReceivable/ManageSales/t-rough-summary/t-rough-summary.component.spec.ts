import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TRoughSummaryComponent } from './t-rough-summary.component';

describe('TRoughSummaryComponent', () => {
  let component: TRoughSummaryComponent;
  let fixture: ComponentFixture<TRoughSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TRoughSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TRoughSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
