import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrOpenAdditionalComponent } from './tr-open-additional.component';

describe('TrOpenAdditionalComponent', () => {
  let component: TrOpenAdditionalComponent;
  let fixture: ComponentFixture<TrOpenAdditionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrOpenAdditionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrOpenAdditionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
