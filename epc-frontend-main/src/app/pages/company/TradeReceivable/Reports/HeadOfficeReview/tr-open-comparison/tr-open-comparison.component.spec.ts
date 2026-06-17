import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrOpenComparisonComponent } from './tr-open-comparison.component';

describe('TrOpenComparisonComponent', () => {
  let component: TrOpenComparisonComponent;
  let fixture: ComponentFixture<TrOpenComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrOpenComparisonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrOpenComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
