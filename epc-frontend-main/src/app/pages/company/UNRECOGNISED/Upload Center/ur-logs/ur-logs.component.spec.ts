import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrLogsComponent } from './ur-logs.component';

describe('UrLogsComponent', () => {
  let component: UrLogsComponent;
  let fixture: ComponentFixture<UrLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
