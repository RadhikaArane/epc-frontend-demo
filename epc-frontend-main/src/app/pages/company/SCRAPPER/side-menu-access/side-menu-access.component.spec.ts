import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenuAccessComponent } from './side-menu-access.component';

describe('SideMenuAccessComponent', () => {
  let component: SideMenuAccessComponent;
  let fixture: ComponentFixture<SideMenuAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideMenuAccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideMenuAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
