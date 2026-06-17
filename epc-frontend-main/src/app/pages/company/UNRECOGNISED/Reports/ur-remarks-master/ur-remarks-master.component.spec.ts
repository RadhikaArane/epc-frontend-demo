import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrRemarksMasterComponent } from './ur-remarks-master.component';

describe('UrRemarksMasterComponent', () => {
  let component: UrRemarksMasterComponent;
  let fixture: ComponentFixture<UrRemarksMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrRemarksMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrRemarksMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
