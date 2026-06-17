import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrKAHComponent } from './scr-kah.component';

describe('ScrKAHComponent', () => {
  let component: ScrKAHComponent;
  let fixture: ComponentFixture<ScrKAHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrKAHComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrKAHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
