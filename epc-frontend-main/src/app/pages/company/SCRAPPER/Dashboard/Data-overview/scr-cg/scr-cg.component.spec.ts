import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrCGComponent } from './scr-cg.component';

describe('ScrCGComponent', () => {
  let component: ScrCGComponent;
  let fixture: ComponentFixture<ScrCGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrCGComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrCGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
