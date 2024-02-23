import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectNotificationComponent } from './reject-notification.component';

describe('RejectNotificationComponent', () => {
  let component: RejectNotificationComponent;
  let fixture: ComponentFixture<RejectNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectNotificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
