import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PbViewCostEstimationComponent } from './pb-view-cost-estimation.component';

describe('PbViewCostEstimationComponent', () => {
  let component: PbViewCostEstimationComponent;
  let fixture: ComponentFixture<PbViewCostEstimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PbViewCostEstimationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PbViewCostEstimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
