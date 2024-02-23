import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedTaskListComponent } from './closed-task-list.component';

describe('ClosedTaskListComponent', () => {
  let component: ClosedTaskListComponent;
  let fixture: ComponentFixture<ClosedTaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClosedTaskListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosedTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
