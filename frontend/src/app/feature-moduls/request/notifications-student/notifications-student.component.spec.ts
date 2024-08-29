import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsStudentComponent } from './notifications-student.component';

describe('NotificationsStudentComponent', () => {
  let component: NotificationsStudentComponent;
  let fixture: ComponentFixture<NotificationsStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationsStudentComponent]
    });
    fixture = TestBed.createComponent(NotificationsStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
