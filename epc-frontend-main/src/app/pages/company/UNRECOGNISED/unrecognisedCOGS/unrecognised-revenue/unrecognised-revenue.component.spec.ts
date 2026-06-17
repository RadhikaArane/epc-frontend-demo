import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnrecognisedRevenueComponent } from './unrecognised-revenue.component';

describe('UnrecognisedRevenueComponent', () => {
  let component: UnrecognisedRevenueComponent;
  let fixture: ComponentFixture<UnrecognisedRevenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnrecognisedRevenueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnrecognisedRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
