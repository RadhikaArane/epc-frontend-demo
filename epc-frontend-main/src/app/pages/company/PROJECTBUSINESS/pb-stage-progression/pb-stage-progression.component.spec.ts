import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PbStageProgressionComponent } from './pb-stage-progression.component';

describe('PbStageProgressionComponent', () => {
  let component: PbStageProgressionComponent;
  let fixture: ComponentFixture<PbStageProgressionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PbStageProgressionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PbStageProgressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
