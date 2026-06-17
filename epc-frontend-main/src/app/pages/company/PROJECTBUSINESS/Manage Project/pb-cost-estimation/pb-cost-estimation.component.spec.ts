import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PbCostEstimationComponent } from './pb-cost-estimation.component';

describe('PbCostEstimationComponent', () => {
  let component: PbCostEstimationComponent;
  let fixture: ComponentFixture<PbCostEstimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PbCostEstimationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PbCostEstimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
