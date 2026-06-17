import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrTNComponent } from './scr-tn.component';

describe('ScrTNComponent', () => {
  let component: ScrTNComponent;
  let fixture: ComponentFixture<ScrTNComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrTNComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrTNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
