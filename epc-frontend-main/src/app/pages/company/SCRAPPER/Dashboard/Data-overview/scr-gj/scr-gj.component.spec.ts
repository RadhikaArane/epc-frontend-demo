import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrGJComponent } from './scr-gj.component';

describe('ScrGJComponent', () => {
  let component: ScrGJComponent;
  let fixture: ComponentFixture<ScrGJComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrGJComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrGJComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
