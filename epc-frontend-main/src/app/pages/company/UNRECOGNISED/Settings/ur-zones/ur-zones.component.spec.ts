import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrZonesComponent } from './ur-zones.component';

describe('UrZonesComponent', () => {
  let component: UrZonesComponent;
  let fixture: ComponentFixture<UrZonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrZonesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrZonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
