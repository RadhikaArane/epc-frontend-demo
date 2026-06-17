import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrShowDataComponent } from './ur-show-data.component';

describe('UrShowDataComponent', () => {
  let component: UrShowDataComponent;
  let fixture: ComponentFixture<UrShowDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrShowDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrShowDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
