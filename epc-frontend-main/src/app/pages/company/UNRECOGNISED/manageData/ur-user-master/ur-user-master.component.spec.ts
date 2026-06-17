import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrUserMasterComponent } from './ur-user-master.component';

describe('UrUserMasterComponent', () => {
  let component: UrUserMasterComponent;
  let fixture: ComponentFixture<UrUserMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrUserMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrUserMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
