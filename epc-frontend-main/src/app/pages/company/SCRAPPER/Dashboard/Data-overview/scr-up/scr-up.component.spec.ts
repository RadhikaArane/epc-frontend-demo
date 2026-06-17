import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrUPComponent } from './scr-up.component';

describe('ScrUPComponent', () => {
  let component: ScrUPComponent;
  let fixture: ComponentFixture<ScrUPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrUPComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrUPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
