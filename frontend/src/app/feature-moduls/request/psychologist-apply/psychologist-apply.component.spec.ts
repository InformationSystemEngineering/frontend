import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsychologistApplyComponent } from './psychologist-apply.component';

describe('PsychologistApplyComponent', () => {
  let component: PsychologistApplyComponent;
  let fixture: ComponentFixture<PsychologistApplyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PsychologistApplyComponent]
    });
    fixture = TestBed.createComponent(PsychologistApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
