import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCollectionsComponent } from './upload-collections.component';

describe('UploadCollectionsComponent', () => {
  let component: UploadCollectionsComponent;
  let fixture: ComponentFixture<UploadCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadCollectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
