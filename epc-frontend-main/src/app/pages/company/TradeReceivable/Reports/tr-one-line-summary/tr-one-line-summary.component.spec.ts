import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrOneLineSummaryComponent } from './tr-one-line-summary.component';

describe('TrOneLineSummaryComponent', () => {
  let component: TrOneLineSummaryComponent;
  let fixture: ComponentFixture<TrOneLineSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrOneLineSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrOneLineSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
