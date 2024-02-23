import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterTodoTaskComponent } from './master-todo-task.component';

describe('MasterTodoTaskComponent', () => {
  let component: MasterTodoTaskComponent;
  let fixture: ComponentFixture<MasterTodoTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterTodoTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterTodoTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
