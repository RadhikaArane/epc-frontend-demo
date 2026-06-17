import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrCollectionComponent } from './tr-collection.component';

describe('TrCollectionComponent', () => {
  let component: TrCollectionComponent;
  let fixture: ComponentFixture<TrCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrCollectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
