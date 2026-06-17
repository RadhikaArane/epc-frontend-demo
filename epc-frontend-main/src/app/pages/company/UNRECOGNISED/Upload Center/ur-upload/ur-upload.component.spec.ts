import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrUploadComponent } from './ur-upload.component';

describe('UrUploadComponent', () => {
  let component: UrUploadComponent;
  let fixture: ComponentFixture<UrUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
