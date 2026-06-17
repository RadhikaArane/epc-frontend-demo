import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiAreaWiseAgingComponent } from './ui-area-wise-aging.component';

describe('UiAreaWiseAgingComponent', () => {
  let component: UiAreaWiseAgingComponent;
  let fixture: ComponentFixture<UiAreaWiseAgingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiAreaWiseAgingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiAreaWiseAgingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
