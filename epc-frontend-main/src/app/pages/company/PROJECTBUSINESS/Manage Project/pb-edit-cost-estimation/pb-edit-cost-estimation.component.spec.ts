import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PbEditCostEstimationComponent } from './pb-edit-cost-estimation.component';

describe('PbEditCostEstimationComponent', () => {
  let component: PbEditCostEstimationComponent;
  let fixture: ComponentFixture<PbEditCostEstimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PbEditCostEstimationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PbEditCostEstimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
