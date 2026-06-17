import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrStateWiseStageComponent } from './ur-state-wise-stage.component';

describe('UrStateWiseStageComponent', () => {
  let component: UrStateWiseStageComponent;
  let fixture: ComponentFixture<UrStateWiseStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrStateWiseStageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrStateWiseStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
