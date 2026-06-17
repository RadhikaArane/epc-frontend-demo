import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiPanIndiaSummaryComponent } from './ui-pan-india-summary.component';

describe('UiPanIndiaSummaryComponent', () => {
  let component: UiPanIndiaSummaryComponent;
  let fixture: ComponentFixture<UiPanIndiaSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiPanIndiaSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiPanIndiaSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
