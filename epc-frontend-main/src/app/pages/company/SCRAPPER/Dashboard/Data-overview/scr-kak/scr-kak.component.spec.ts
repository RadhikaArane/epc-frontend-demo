import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrKAKComponent } from './scr-kak.component';

describe('ScrKAKComponent', () => {
  let component: ScrKAKComponent;
  let fixture: ComponentFixture<ScrKAKComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrKAKComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrKAKComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
