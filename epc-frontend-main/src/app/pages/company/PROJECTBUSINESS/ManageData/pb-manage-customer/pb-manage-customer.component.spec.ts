import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PbManageCustomerComponent } from './pb-manage-customer.component';

describe('PbManageCustomerComponent', () => {
  let component: PbManageCustomerComponent;
  let fixture: ComponentFixture<PbManageCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PbManageCustomerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PbManageCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
