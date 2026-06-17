import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaDashboardComponent } from './fa-dashboard.component';

describe('FaDashboardComponent', () => {
  let component: FaDashboardComponent;
  let fixture: ComponentFixture<FaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
