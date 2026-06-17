import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaVerifiedAssetComponent } from './fa-verified-asset.component';

describe('FaVerifiedAssetComponent', () => {
  let component: FaVerifiedAssetComponent;
  let fixture: ComponentFixture<FaVerifiedAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaVerifiedAssetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaVerifiedAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
