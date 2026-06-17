import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PbManageVendorComponent } from './pb-manage-vendor.component';

describe('PbManageVendorComponent', () => {
  let component: PbManageVendorComponent;
  let fixture: ComponentFixture<PbManageVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PbManageVendorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PbManageVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
