import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrRunJobsComponent } from './scr-run-jobs.component';

describe('ScrRunJobsComponent', () => {
  let component: ScrRunJobsComponent;
  let fixture: ComponentFixture<ScrRunJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrRunJobsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrRunJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
