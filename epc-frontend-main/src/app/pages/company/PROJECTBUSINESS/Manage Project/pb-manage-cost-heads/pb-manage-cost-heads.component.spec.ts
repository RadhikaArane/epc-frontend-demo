import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PbManageCostHeadsComponent } from './pb-manage-cost-heads.component';

describe('PbManageCostHeadsComponent', () => {
  let component: PbManageCostHeadsComponent;
  let fixture: ComponentFixture<PbManageCostHeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PbManageCostHeadsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PbManageCostHeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
