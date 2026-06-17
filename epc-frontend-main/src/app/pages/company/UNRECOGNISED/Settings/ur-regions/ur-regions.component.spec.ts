import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrRegionsComponent } from './ur-regions.component';

describe('UrRegionsComponent', () => {
  let component: UrRegionsComponent;
  let fixture: ComponentFixture<UrRegionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrRegionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrRegionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
