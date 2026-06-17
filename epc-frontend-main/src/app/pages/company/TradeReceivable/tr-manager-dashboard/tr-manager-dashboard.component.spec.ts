import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrManagerDashboardComponent } from './tr-manager-dashboard.component';

describe('TrManagerDashboardComponent', () => {
  let component: TrManagerDashboardComponent;
  let fixture: ComponentFixture<TrManagerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrManagerDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrManagerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
