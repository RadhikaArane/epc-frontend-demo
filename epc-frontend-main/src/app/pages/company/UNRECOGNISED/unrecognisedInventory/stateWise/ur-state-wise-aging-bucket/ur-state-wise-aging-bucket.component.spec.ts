import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrStateWiseAgingBucketComponent } from './ur-state-wise-aging-bucket.component';

describe('UrStateWiseAgingBucketComponent', () => {
  let component: UrStateWiseAgingBucketComponent;
  let fixture: ComponentFixture<UrStateWiseAgingBucketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrStateWiseAgingBucketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrStateWiseAgingBucketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
