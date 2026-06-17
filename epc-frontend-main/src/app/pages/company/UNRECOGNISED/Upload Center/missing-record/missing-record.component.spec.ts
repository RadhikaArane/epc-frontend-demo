import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingRecordComponent } from './missing-record.component';

describe('MissingRecordComponent', () => {
  let component: MissingRecordComponent;
  let fixture: ComponentFixture<MissingRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissingRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissingRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
