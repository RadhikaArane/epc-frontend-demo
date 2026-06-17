import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PbAllProjectAnalyticsComponent } from './pb-all-project-analytics.component';

describe('PbAllProjectAnalyticsComponent', () => {
  let component: PbAllProjectAnalyticsComponent;
  let fixture: ComponentFixture<PbAllProjectAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PbAllProjectAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PbAllProjectAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
