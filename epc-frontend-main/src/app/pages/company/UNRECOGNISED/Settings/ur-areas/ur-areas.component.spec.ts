import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrAreasComponent } from './ur-areas.component';

describe('UrAreasComponent', () => {
  let component: UrAreasComponent;
  let fixture: ComponentFixture<UrAreasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrAreasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
