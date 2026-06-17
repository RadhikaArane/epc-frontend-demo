import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PbManageSubCostHeadsComponent } from './pb-manage-sub-cost-heads.component';

describe('PbManageSubCostHeadsComponent', () => {
  let component: PbManageSubCostHeadsComponent;
  let fixture: ComponentFixture<PbManageSubCostHeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PbManageSubCostHeadsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PbManageSubCostHeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
