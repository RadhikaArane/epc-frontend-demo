import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PbAddNewProjectComponent } from './pb-add-new-project.component';

describe('PbAddNewProjectComponent', () => {
  let component: PbAddNewProjectComponent;
  let fixture: ComponentFixture<PbAddNewProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PbAddNewProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PbAddNewProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
