import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrOpenMarketComponent } from './tr-open-market.component';

describe('TrOpenMarketComponent', () => {
  let component: TrOpenMarketComponent;
  let fixture: ComponentFixture<TrOpenMarketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrOpenMarketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrOpenMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
