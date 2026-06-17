import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnrecogmisedInventoryComponent } from './unrecogmised-inventory.component';

describe('UnrecogmisedInventoryComponent', () => {
  let component: UnrecogmisedInventoryComponent;
  let fixture: ComponentFixture<UnrecogmisedInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnrecogmisedInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnrecogmisedInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
