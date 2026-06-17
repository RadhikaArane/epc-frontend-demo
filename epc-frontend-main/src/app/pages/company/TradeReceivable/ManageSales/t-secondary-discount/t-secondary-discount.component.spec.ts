import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TSecondaryDiscountComponent } from './t-secondary-discount.component';

describe('TSecondaryDiscountComponent', () => {
  let component: TSecondaryDiscountComponent;
  let fixture: ComponentFixture<TSecondaryDiscountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TSecondaryDiscountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TSecondaryDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
