import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PbExtensionLetterComponent } from './pb-extension-letter.component';

describe('PbExtensionLetterComponent', () => {
  let component: PbExtensionLetterComponent;
  let fixture: ComponentFixture<PbExtensionLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PbExtensionLetterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PbExtensionLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
