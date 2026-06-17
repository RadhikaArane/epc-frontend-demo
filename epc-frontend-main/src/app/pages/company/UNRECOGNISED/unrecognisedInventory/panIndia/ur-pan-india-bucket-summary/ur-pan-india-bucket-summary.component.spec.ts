import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrPanIndiaBucketSummaryComponent } from './ur-pan-india-bucket-summary.component';

describe('UrPanIndiaBucketSummaryComponent', () => {
  let component: UrPanIndiaBucketSummaryComponent;
  let fixture: ComponentFixture<UrPanIndiaBucketSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrPanIndiaBucketSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrPanIndiaBucketSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
