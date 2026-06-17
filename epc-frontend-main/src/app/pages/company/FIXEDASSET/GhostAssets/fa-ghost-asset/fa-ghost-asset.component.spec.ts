import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaGhostAssetComponent } from './fa-ghost-asset.component';

describe('FaGhostAssetComponent', () => {
  let component: FaGhostAssetComponent;
  let fixture: ComponentFixture<FaGhostAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaGhostAssetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaGhostAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
