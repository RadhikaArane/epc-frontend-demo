import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PbWorkOrderAgreementsComponent } from './pb-work-order-agreements.component';

describe('PbWorkOrderAgreementsComponent', () => {
  let component: PbWorkOrderAgreementsComponent;
  let fixture: ComponentFixture<PbWorkOrderAgreementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PbWorkOrderAgreementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PbWorkOrderAgreementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
