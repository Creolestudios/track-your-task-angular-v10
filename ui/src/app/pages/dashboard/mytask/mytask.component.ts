import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TodoTaskService } from '../../../_services/todo-task.service';
import { TodoDialogComponent } from '../../../pages/dialog/todo-dialog.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-mytask',
  templateUrl: './mytask.component.html',
  styleUrls: ['./mytask.component.css']
})
export class MytaskComponent implements OnInit {
  myTaskList = []
  groupList = []
  dataList = []
  globalSelectedGroup: any
  selectedStatus: string;
  errorMesg = false;
  taskSearch
  taskDetailsData = [];
  constructor(public todoTaskService: TodoTaskService,
    private toastr: ToastrService,
    public dialog: MatDialog,) {
    this.dataList = [
      { id: 1, name: "Open" },
      { id: 2, name: "In Progress" },
      { id: 3, name: "Done" }
    ]
  }
  private eventsSubscription: Subscription;
  @Input() events: Observable<void>;

  ngOnInit(): void {
    this.getGroupList()
  }


  getGroupList() {
    this.todoTaskService.getGroupList().subscribe((res) => {
      this.groupList = res.groups;
      let getGroupId = localStorage.getItem('groupId');
      this.globalSelectedGroup = this.groupList[0]?.groupId ? this.groupList[0]?.groupId : getGroupId;
      console.log(this.globalSelectedGroup)
      if(this.globalSelectedGroup == undefined || this.globalSelectedGroup == null) {
        return
      }
      this.getMyTasks(this.globalSelectedGroup)
    }, (error) => {

    });
  }
  getSelectedGroupId(groupId: string) {
    if (groupId == null || groupId == undefined) {
      return
    }
    this.getMyTasks(groupId)
  }


  getMyTasks(groupId) {
    if (groupId == null || groupId == undefined) {
      return
    }
    let taskFilterBody = {
      groupId: groupId,
      taskAssignTo: 'mytasks',
      taskDueDate: '',
      taskStatus: ''
    }
    this.todoTaskService.getFilterTaskList(taskFilterBody).subscribe((res) => {
      if (res.status === false) {
      } else {
        if (res.taskList.length > 0) {
          this.myTaskList = res.taskList;
          this.errorMesg = false;
        } else {
          this.myTaskList = [];
          this.errorMesg = true;
        }
      }
    }, (error) => {
    });
  }

  taskStatusValue(value) {
    this.selectedStatus = value.taskStatus;
  }

  cancelRemoveClick(ev: MouseEvent) {
    ev.stopPropagation();
  }
  getTaskStatusValue(event, rowData) {
    let data = {
      taskStatus: event.name
    }
    this.todoTaskService.updateTaskStatus(rowData.taskId, data).subscribe((res) => {
      if (res.status === false) {
      } else {
        if (res.status === 'success') {
          this.toastr.success('Success', res.message);
          this.getMyTasks(rowData.groupId)
        }
      }
    }, (error) => {

    });
  }
  add3Dots(string, limit) {
    var dots = "....";
    if (string.length > limit) {
      string = string.substring(0, limit) + dots;
    }
    return string;
  }
  getTaskDetailsById(taskId) {
    if (taskId != null || taskId != undefined || taskId != "")
      this.todoTaskService.getTaskDetails(taskId).subscribe((res) => {
        if (res) {
          this.taskDetailsData = res;
          const dialogRef = this.dialog.open(TodoDialogComponent, {
            width: '740px',
            height: 'auto',
            backdropClass: 'custom-dialog-backdrop-class',
            panelClass: 'custom-dialog-panel-class',
            data: { pageValue: this.taskDetailsData }
          });
          dialogRef.afterClosed().subscribe(result => {
          });
        }

      }, (error) => {
        this.toastr.error('Error', error);
      });
  }
}
