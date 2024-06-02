import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackJournalingDialogComponent } from './feedback-journaling-dialog.component';

describe('FeedbackJournalingDialogComponent', () => {
  let component: FeedbackJournalingDialogComponent;
  let fixture: ComponentFixture<FeedbackJournalingDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackJournalingDialogComponent]
    });
    fixture = TestBed.createComponent(FeedbackJournalingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
