import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrCogsPanWiseBucketComponent } from './ur-cogs-pan-wise-bucket.component';

describe('UrCogsPanWiseBucketComponent', () => {
  let component: UrCogsPanWiseBucketComponent;
  let fixture: ComponentFixture<UrCogsPanWiseBucketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrCogsPanWiseBucketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrCogsPanWiseBucketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
