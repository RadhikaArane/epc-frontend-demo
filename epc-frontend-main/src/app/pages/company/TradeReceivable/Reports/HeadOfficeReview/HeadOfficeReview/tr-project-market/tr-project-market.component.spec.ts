import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrProjectMarketComponent } from './tr-project-market.component';

describe('TrProjectMarketComponent', () => {
  let component: TrProjectMarketComponent;
  let fixture: ComponentFixture<TrProjectMarketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrProjectMarketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrProjectMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
