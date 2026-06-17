import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSidebarMenuComponent } from './add-sidebar-menu.component';

describe('AddSidebarMenuComponent', () => {
  let component: AddSidebarMenuComponent;
  let fixture: ComponentFixture<AddSidebarMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSidebarMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSidebarMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
