import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PbUserRoleManagementComponent } from './pb-user-role-management.component';

describe('PbUserRoleManagementComponent', () => {
  let component: PbUserRoleManagementComponent;
  let fixture: ComponentFixture<PbUserRoleManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PbUserRoleManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PbUserRoleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
