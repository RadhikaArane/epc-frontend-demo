import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PbExpenceTrackingComponent } from './pb-expence-tracking.component';

describe('PbExpenceTrackingComponent', () => {
  let component: PbExpenceTrackingComponent;
  let fixture: ComponentFixture<PbExpenceTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PbExpenceTrackingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PbExpenceTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
