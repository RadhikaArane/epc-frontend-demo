import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PbNodalAgencyComponent } from './pb-nodal-agency.component';

describe('PbNodalAgencyComponent', () => {
  let component: PbNodalAgencyComponent;
  let fixture: ComponentFixture<PbNodalAgencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PbNodalAgencyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PbNodalAgencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
