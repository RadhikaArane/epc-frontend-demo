import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TGroupingSaleComponent } from './t-grouping-sale.component';

describe('TGroupingSaleComponent', () => {
  let component: TGroupingSaleComponent;
  let fixture: ComponentFixture<TGroupingSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TGroupingSaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TGroupingSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
