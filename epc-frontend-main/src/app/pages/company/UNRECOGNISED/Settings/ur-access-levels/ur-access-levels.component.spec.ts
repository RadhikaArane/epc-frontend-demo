import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrAccessLevelsComponent } from './ur-access-levels.component';

describe('UrAccessLevelsComponent', () => {
  let component: UrAccessLevelsComponent;
  let fixture: ComponentFixture<UrAccessLevelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrAccessLevelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrAccessLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
