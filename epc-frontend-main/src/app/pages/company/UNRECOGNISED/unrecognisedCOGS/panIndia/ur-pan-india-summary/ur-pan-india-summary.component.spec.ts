import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrPanIndiaSummaryComponent } from './ur-pan-india-summary.component';

describe('UrPanIndiaSummaryComponent', () => {
  let component: UrPanIndiaSummaryComponent;
  let fixture: ComponentFixture<UrPanIndiaSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrPanIndiaSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrPanIndiaSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
