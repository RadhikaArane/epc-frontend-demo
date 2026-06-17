import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrAPComponent } from './scr-ap.component';

describe('ScrAPComponent', () => {
  let component: ScrAPComponent;
  let fixture: ComponentFixture<ScrAPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrAPComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrAPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
