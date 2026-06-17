import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrPmAgeingComponent } from './tr-pm-ageing.component';

describe('TrPmAgeingComponent', () => {
  let component: TrPmAgeingComponent;
  let fixture: ComponentFixture<TrPmAgeingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrPmAgeingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrPmAgeingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
