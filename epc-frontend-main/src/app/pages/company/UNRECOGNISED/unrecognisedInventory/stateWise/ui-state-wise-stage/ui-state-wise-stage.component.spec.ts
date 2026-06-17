import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiStateWiseStageComponent } from './ui-state-wise-stage.component';

describe('UiStateWiseStageComponent', () => {
  let component: UiStateWiseStageComponent;
  let fixture: ComponentFixture<UiStateWiseStageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiStateWiseStageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiStateWiseStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
