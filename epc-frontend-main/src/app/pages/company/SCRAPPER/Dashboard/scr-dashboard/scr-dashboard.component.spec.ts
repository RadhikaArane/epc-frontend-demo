import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrDashboardComponent } from './scr-dashboard.component';

describe('ScrDashboardComponent', () => {
  let component: ScrDashboardComponent;
  let fixture: ComponentFixture<ScrDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
