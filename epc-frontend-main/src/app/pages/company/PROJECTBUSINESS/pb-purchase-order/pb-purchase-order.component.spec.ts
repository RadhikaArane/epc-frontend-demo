import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PbPurchaseOrderComponent } from './pb-purchase-order.component';

describe('PbPurchaseOrderComponent', () => {
  let component: PbPurchaseOrderComponent;
  let fixture: ComponentFixture<PbPurchaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PbPurchaseOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PbPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
