import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrTGComponent } from './scr-tg.component';

describe('ScrTGComponent', () => {
  let component: ScrTGComponent;
  let fixture: ComponentFixture<ScrTGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrTGComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrTGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
