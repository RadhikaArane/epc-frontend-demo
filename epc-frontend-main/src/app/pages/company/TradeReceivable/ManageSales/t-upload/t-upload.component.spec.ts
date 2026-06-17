import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TUploadComponent } from './t-upload.component';

describe('TUploadComponent', () => {
  let component: TUploadComponent;
  let fixture: ComponentFixture<TUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
