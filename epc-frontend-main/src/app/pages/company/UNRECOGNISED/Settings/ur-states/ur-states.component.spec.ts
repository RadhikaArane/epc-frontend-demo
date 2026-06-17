import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrStatesComponent } from './ur-states.component';

describe('UrStatesComponent', () => {
  let component: UrStatesComponent;
  let fixture: ComponentFixture<UrStatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrStatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrStatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
