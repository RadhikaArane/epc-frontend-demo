import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PbAddCostEstimationComponent } from './pb-add-cost-estimation.component';

describe('PbAddCostEstimationComponent', () => {
  let component: PbAddCostEstimationComponent;
  let fixture: ComponentFixture<PbAddCostEstimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PbAddCostEstimationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PbAddCostEstimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
