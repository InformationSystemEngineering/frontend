import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailRegistrationComponent } from './fail-registration.component';

describe('FailRegistrationComponent', () => {
  let component: FailRegistrationComponent;
  let fixture: ComponentFixture<FailRegistrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FailRegistrationComponent]
    });
    fixture = TestBed.createComponent(FailRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
