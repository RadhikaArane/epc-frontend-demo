import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PbProjectManagementComponent } from './pb-project-management.component';

describe('PbProjectManagementComponent', () => {
  let component: PbProjectManagementComponent;
  let fixture: ComponentFixture<PbProjectManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PbProjectManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PbProjectManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
