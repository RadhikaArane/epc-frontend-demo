import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrCogsStateWiseBucketComponent } from './ur-cogs-state-wise-bucket.component';

describe('UrCogsStateWiseBucketComponent', () => {
  let component: UrCogsStateWiseBucketComponent;
  let fixture: ComponentFixture<UrCogsStateWiseBucketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrCogsStateWiseBucketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrCogsStateWiseBucketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
