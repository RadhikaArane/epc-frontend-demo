import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrUserLogsComponent } from './scr-user-logs.component';

describe('ScrUserLogsComponent', () => {
  let component: ScrUserLogsComponent;
  let fixture: ComponentFixture<ScrUserLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrUserLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrUserLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
