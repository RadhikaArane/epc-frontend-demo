import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrSalesComponent } from './tr-sales.component';

describe('TrSalesComponent', () => {
  let component: TrSalesComponent;
  let fixture: ComponentFixture<TrSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
