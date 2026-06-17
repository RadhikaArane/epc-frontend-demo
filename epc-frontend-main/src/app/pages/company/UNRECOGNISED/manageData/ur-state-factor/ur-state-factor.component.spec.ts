import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrStateFactorComponent } from './ur-state-factor.component';

describe('UrStateFactorComponent', () => {
  let component: UrStateFactorComponent;
  let fixture: ComponentFixture<UrStateFactorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrStateFactorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrStateFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
