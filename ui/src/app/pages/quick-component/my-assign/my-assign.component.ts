import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { TodoTaskService } from './../../../_services/todo-task.service';
import { EditTaskDialogComponent } from '././../../dialog/task-edit-dialog/edittask-dialog.component';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TodoDialogComponent } from '@app/pages/dialog/todo-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-my-assign',
  templateUrl: './my-assign.component.html',
  styleUrls: ['./my-assign.component.css'],
})
export class MyAssignComponent implements OnInit {
  InProgressTaskList = [];
  DoneTaskList = [];
  OpenTaskList = [];
  dataList = [];
  pre;
  groupList = [];
  groupBytaskList = [];
  groupMemberData: any;
  groupTaskList = [];
  taskDetailsData: any;
  selectedStatus: string;
  selectedUser: string;
  tooltipUserName: any;

  constructor(
    private todoTaskService: TodoTaskService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private cdref: ChangeDetectorRef
  ) {
    this.dataList = [
      { id: 1, name: 'Open' },
      { id: 2, name: 'In Progress' },
      { id: 3, name: 'Done' },
    ];
  }

  ngOnInit(): void {
    this.getMyTasks();
  }

  getMyTasks() {
    this.todoTaskService.getTaskDataAssinedByGroups().subscribe((res) => {
      this.groupBytaskList = res.taskList;
      this.OpenTaskList = []
      this.InProgressTaskList = []
      for (let m = 0; m < res.taskList.length; m++) {
        if (res.taskList[m].taskStatus == 'Open') {
          this.OpenTaskList.push({
            userId: res.taskList[m].taskAssignTo,
            groupName: res.taskList[m].groupName,
            taskStatus: res.taskList[m].taskStatus,
            taskDescription: res.taskList[m].taskDescription,
            groupId: res.taskList[m].groupId,
            taskId: res.taskList[m].taskId,
            taskDueDate: res.taskList[m].taskDueDate,
            userName: res.taskList[m].userDetails.userName,
            taskAssignTo: res.taskList[m].taskAssignTo,
          });
        } else if (res.taskList[m].taskStatus == 'In Progress') {
          this.InProgressTaskList.push({
            userId: res.taskList[m].taskAssignTo,
            groupName: res.taskList[m].groupName,
            taskStatus: res.taskList[m].taskStatus,
            taskDescription: res.taskList[m].taskDescription,
            groupId: res.taskList[m].groupId,
            taskId: res.taskList[m].taskId,
            taskDueDate: res.taskList[m].taskDueDate,
            userName: res.taskList[m].userDetails.userName,
            taskAssignTo: res.taskList[m].taskAssignTo,
          });
        }
      }
    });
    // return this.groupBytaskList;
  }
  // getGroupList() {
  //   this.todoTaskService.getGroupList().subscribe(
  //     (res) => {
  //       this.groupList = res.groups;
  //       let getGroupId = localStorage.getItem('groupId');


  //     },
  //     (error) => {}
  //   );
  // }

  getTaskDetailsById(taskId) {
    if (taskId != null || taskId != undefined || taskId != '')
      this.todoTaskService.getTaskDetails(taskId).subscribe(
        (res) => {
          if (res) {
            this.taskDetailsData = res;
            const dialogRef = this.dialog.open(TodoDialogComponent, {
              width: '740px',
              height: 'auto',
              backdropClass: 'custom-dialog-backdrop-class',
              panelClass: 'custom-dialog-panel-class',
              data: { pageValue: this.taskDetailsData },
            });
            dialogRef.afterClosed().subscribe((result) => {});
          }
        },
        (error) => {
          this.toastr.error('Error', error);
        }
      );
  }

  add3Dots(string, limit) {
    var dots = '....';
    if (string.length > limit) {
      // you can also use substr instead of substring
      string = string.substring(0, limit) + dots;
    }
    return string;
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    let todayDate = new Date();
    const today = moment(todayDate).format('YYYY-MM-DD');

    // let InProgressTaskListArr = this.InProgressTaskList.filter(item => item.taskDueDate <= today)
    // console.log(InProgressTaskListArr)
    // console.log(InProgressTaskListArr.sort())
    this.pre = `
Open:
${JSON.stringify(this.OpenTaskList, null, ' ')}


inprogress:
${JSON.stringify(this.InProgressTaskList, null, ' ')}

done:
${JSON.stringify(this.DoneTaskList, null, ' ')}`;
    let dropTaskProgress = this.InProgressTaskList[event.currentIndex];
    let dropTaskDone = this.DoneTaskList[event.currentIndex];
    let dropTaskOpen = this.OpenTaskList[event.currentIndex];
    if (event.container.id == event.previousContainer.id) {
      return false;
    }
    if (event.container.id === 'progresList') {
      let body = {
        containerName: 'progresList',
        arrTaskList: dropTaskProgress,
        taskDisplayOrder: event.currentIndex,
        prevousIndex: event.previousIndex,
        containerData: event.container.data,
      };
      this.getDragAndDropValues(body, dropTaskProgress);
    } else if (event.container.id === 'openList') {
      let body = {
        containerName: 'openList',
        arrTaskList: dropTaskOpen,
        taskDisplayOrder: event.currentIndex,
        prevousIndex: event.previousIndex,
      };
      this.getDragAndDropValues(body, dropTaskOpen);
    }
  }
  getDragAndDropValues(arrBody, arrTaskList) {
    if (arrBody.length == 0) {
      return;
    }
    this.todoTaskService.saveDragAndDropData(arrBody).subscribe(
      (res) => {
        if (res.status === false) {
        } else {
          if (res.status === 'success') {
            this.getMyTasks();
          }
        }
      },
      (error) => {
        this.toastr.error('Error', error);
      }
    );
  }

  cancelRemoveClick(ev: MouseEvent) {
    ev.stopPropagation();
  }

  taskStatusValue(value) {
    this.selectedStatus = value.taskStatus;
  }

  getTaskStatusValue(event, rowData) {
    let data = {
      taskStatus: event.name,
    };
    this.todoTaskService.updateTaskStatus(rowData.taskId, data).subscribe(
      (res) => {
        if (res.status === false) {
        } else {
          if (res.status === 'success') {
            this.toastr.success('Success', res.message);
            this.getMyTasks()
          }
        }
      },
      (error) => {}
    );
  }

  getUserNameTooltip(taskRow): string {
    return (this.tooltipUserName = taskRow.userName);
  }

  taskUserChange(value) {
    this.getGroupMembers(value.groupId);
    if (value.taskAssignTo == null) {
      this.selectedUser = '';
    } else {
      this.selectedUser = value.taskAssignTo;
    }
  }

  public taskUserChangeByUser(data, event) {
    if (event == null || event == undefined) {
      return false;
    }
    let updateData = {
      groupId: event.groupId,
      taskDescription: event.taskDescription,
      taskAssignTo: data,
      taskDueDate: event.taskDueDate,
      taskStatus: event.taskStatus,
    };

    this.todoTaskService.updateGroupTask(event.taskId, updateData).subscribe(
      (res) => {
        if (res.status === false) {
        } else {
          if (res.status === 'success') {
            this.getMyTasks();
          }
        }
      },
      (error) => {
        this.toastr.error('Error', error);
        if (error === 'Token Expired') {
        }
      }
    );
  }

  getGroupMembers(groupId) {
    if (groupId == null || groupId == undefined || groupId == '') {
      return;
    } else {
      this.todoTaskService.getGroupMembers(groupId).subscribe(
        (res) => {
          this.groupMemberData = res.groupMembers;
        },
        (error) => {}
      );
    }
  }
}
