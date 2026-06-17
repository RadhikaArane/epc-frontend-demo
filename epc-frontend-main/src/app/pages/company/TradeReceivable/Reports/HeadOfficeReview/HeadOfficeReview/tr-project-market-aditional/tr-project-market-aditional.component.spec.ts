import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrProjectMarketAditionalComponent } from './tr-project-market-aditional.component';

describe('TrProjectMarketAditionalComponent', () => {
  let component: TrProjectMarketAditionalComponent;
  let fixture: ComponentFixture<TrProjectMarketAditionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrProjectMarketAditionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrProjectMarketAditionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
