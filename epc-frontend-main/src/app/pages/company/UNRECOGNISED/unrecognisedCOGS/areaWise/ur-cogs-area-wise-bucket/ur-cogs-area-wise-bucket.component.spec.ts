import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrCogsAreaWiseBucketComponent } from './ur-cogs-area-wise-bucket.component';

describe('UrCogsAreaWiseBucketComponent', () => {
  let component: UrCogsAreaWiseBucketComponent;
  let fixture: ComponentFixture<UrCogsAreaWiseBucketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrCogsAreaWiseBucketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrCogsAreaWiseBucketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
