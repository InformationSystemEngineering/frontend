import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestOnHoldComponent } from './request-on-hold.component';

describe('RequestOnHoldComponent', () => {
  let component: RequestOnHoldComponent;
  let fixture: ComponentFixture<RequestOnHoldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestOnHoldComponent]
    });
    fixture = TestBed.createComponent(RequestOnHoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
