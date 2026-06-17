import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PbUnrecognisedProjectsComponent } from './pb-unrecognised-projects.component';

describe('PbUnrecognisedProjectsComponent', () => {
  let component: PbUnrecognisedProjectsComponent;
  let fixture: ComponentFixture<PbUnrecognisedProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PbUnrecognisedProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PbUnrecognisedProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
