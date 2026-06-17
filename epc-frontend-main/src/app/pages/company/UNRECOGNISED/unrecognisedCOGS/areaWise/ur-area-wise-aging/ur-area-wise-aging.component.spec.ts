import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrAreaWiseAgingComponent } from './ur-area-wise-aging.component';

describe('UrAreaWiseAgingComponent', () => {
  let component: UrAreaWiseAgingComponent;
  let fixture: ComponentFixture<UrAreaWiseAgingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrAreaWiseAgingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrAreaWiseAgingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
