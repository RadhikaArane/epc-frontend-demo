import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrAgeingBucketConfigComponent } from './ur-ageing-bucket-config.component';

describe('UrAgeingBucketConfigComponent', () => {
  let component: UrAgeingBucketConfigComponent;
  let fixture: ComponentFixture<UrAgeingBucketConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrAgeingBucketConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrAgeingBucketConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
