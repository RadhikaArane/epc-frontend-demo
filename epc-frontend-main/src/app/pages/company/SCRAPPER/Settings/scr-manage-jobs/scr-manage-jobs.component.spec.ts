import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrManageJobsComponent } from './scr-manage-jobs.component';

describe('ScrManageJobsComponent', () => {
  let component: ScrManageJobsComponent;
  let fixture: ComponentFixture<ScrManageJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrManageJobsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrManageJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
