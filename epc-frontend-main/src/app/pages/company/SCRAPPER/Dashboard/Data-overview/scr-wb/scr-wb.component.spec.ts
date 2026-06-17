import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrWBComponent } from './scr-wb.component';

describe('ScrWBComponent', () => {
  let component: ScrWBComponent;
  let fixture: ComponentFixture<ScrWBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrWBComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrWBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
