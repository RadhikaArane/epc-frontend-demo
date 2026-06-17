import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrAdditionalPddOpenMarketComponent } from './tr-additional-pdd-open-market.component';

describe('TrAdditionalPddOpenMarketComponent', () => {
  let component: TrAdditionalPddOpenMarketComponent;
  let fixture: ComponentFixture<TrAdditionalPddOpenMarketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrAdditionalPddOpenMarketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrAdditionalPddOpenMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
