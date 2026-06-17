import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrAccessComponent } from './ur-access.component';

describe('UrAccessComponent', () => {
  let component: UrAccessComponent;
  let fixture: ComponentFixture<UrAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrAccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
