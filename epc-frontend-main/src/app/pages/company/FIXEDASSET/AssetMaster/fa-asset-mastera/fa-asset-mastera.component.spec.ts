import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaAssetMasteraComponent } from './fa-asset-mastera.component';

describe('FaAssetMasteraComponent', () => {
  let component: FaAssetMasteraComponent;
  let fixture: ComponentFixture<FaAssetMasteraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaAssetMasteraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaAssetMasteraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
