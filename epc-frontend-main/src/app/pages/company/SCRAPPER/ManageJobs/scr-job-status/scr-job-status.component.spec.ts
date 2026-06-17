import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrJobStatusComponent } from './scr-job-status.component';

describe('ScrJobStatusComponent', () => {
  let component: ScrJobStatusComponent;
  let fixture: ComponentFixture<ScrJobStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrJobStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrJobStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
