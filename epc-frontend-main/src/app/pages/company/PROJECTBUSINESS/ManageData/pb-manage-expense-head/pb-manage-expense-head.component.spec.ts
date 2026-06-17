import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PbManageExpenseHeadComponent } from './pb-manage-expense-head.component';

describe('PbManageExpenseHeadComponent', () => {
  let component: PbManageExpenseHeadComponent;
  let fixture: ComponentFixture<PbManageExpenseHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PbManageExpenseHeadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PbManageExpenseHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
