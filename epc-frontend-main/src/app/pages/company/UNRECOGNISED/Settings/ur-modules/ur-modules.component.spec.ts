import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrModulesComponent } from './ur-modules.component';

describe('UrModulesComponent', () => {
  let component: UrModulesComponent;
  let fixture: ComponentFixture<UrModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrModulesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
