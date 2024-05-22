import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyStudentForTestComponent } from './apply-student-for-test.component';

describe('ApplyStudentForTestComponent', () => {
  let component: ApplyStudentForTestComponent;
  let fixture: ComponentFixture<ApplyStudentForTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplyStudentForTestComponent]
    });
    fixture = TestBed.createComponent(ApplyStudentForTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
