import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrMPComponent } from './scr-mp.component';

describe('ScrMPComponent', () => {
  let component: ScrMPComponent;
  let fixture: ComponentFixture<ScrMPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrMPComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrMPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
