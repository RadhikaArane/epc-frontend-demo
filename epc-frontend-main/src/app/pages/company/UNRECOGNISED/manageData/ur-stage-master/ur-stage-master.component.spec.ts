import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrStageMasterComponent } from './ur-stage-master.component';

describe('UrStageMasterComponent', () => {
  let component: UrStageMasterComponent;
  let fixture: ComponentFixture<UrStageMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrStageMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrStageMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
