import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrRolesComponent } from './ur-roles.component';

describe('UrRolesComponent', () => {
  let component: UrRolesComponent;
  let fixture: ComponentFixture<UrRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrRolesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
