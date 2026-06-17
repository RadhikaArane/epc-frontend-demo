import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrAreaWiseAgingBucketComponent } from './ur-area-wise-aging-bucket.component';

describe('UrAreaWiseAgingBucketComponent', () => {
  let component: UrAreaWiseAgingBucketComponent;
  let fixture: ComponentFixture<UrAreaWiseAgingBucketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrAreaWiseAgingBucketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrAreaWiseAgingBucketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
