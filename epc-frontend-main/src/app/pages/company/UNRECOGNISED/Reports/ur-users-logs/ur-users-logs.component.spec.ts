import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrUsersLogsComponent } from './ur-users-logs.component';

describe('UrUsersLogsComponent', () => {
  let component: UrUsersLogsComponent;
  let fixture: ComponentFixture<UrUsersLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrUsersLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrUsersLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
