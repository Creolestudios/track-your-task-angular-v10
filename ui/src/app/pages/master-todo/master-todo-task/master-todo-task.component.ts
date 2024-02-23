import { Component, OnInit, OnDestroy } from '@angular/core';
import { TodoTaskService } from '../../../_services/todo-task.service';
import { DataService } from './../../../_services/data.service';
import { ConfirmComponent, ConfirmDialogModel } from '../../../pages/dialog/confirm.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DatePipe, formatDate } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MasterTodoDialogComponent } from './../../dialog/master-todo-dialog.component'
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-master-todo-task',
  templateUrl: './master-todo-task.component.html',
  styleUrls: ['./master-todo-task.component.css']
})
export class MasterTodoTaskComponent implements OnInit, OnDestroy {
  groupTaskList: any = [];
  isDisplayed = false;
  masterData;
  taskErrorMsg: any;
  groupMemberData: [];
  selectedUser: any;
  selectedFrequency: any;
  FrequencydataList: Array<any> = [];
  masterTaskDetails: any;
  minDate = new Date(Date.now() + (3600 * 1000 * 24))
  masterTaskId: any
  // destroyVal: any;
  constructor(public datepipe: DatePipe,
    private todoTaskService: TodoTaskService,
    private dataService: DataService,
    public dialog: MatDialog, private toastr: ToastrService) {

    this.dataService.getMastTaskListData()
      .subscribe(taskListData => {
        // localStorage.removeItem("masterGroupId");
        let masterGroupId = localStorage.getItem('masterGroupId');
        if (masterGroupId != null) {
          this.groupTaskList = taskListData.mastTaskList;
          if (Object.keys(taskListData).length == 0) {
            this.taskErrorMsg = true;
            this.groupTaskList = [];
            this.dataService.setTaskId({
              editTask: false
            });
          } else {
            this.isDisplayed = true;
            this.groupTaskList = taskListData.mastTaskList;
            this.dataService.setTaskId({
              editTask: false
            });
            if (this.groupTaskList == undefined) {
              this.groupTaskList;
              this.taskErrorMsg = true;
              this.dataService.setTaskId({
                editTask: false
              });
            } else {
              if (this.groupTaskList.length == 0) {
                this.taskErrorMsg = true;
                this.dataService.setTaskId({
                  editTask: false
                });
              } else {
                this.taskErrorMsg = false;
                
              }
            }
          }
        } else {
          return this.taskErrorMsg = true;
        }
      });


    this.dataService.getGroupUserData().subscribe(data => {
      this.groupMemberData = data.data;
    })

    this.FrequencydataList = [
      { id: 1, name: "Daily" },
      { id: 2, name: "Weekly" },
      { id: 3, name: "Monthly" }
    ]
  }

  ngOnInit(): void {

    // this.dataService.getMastTaskListData().pipe(takeUntil(this.unsubscribe$)).subscribe(taskListData => {
    //   this.groupTaskList = taskListData;
    //   Object.keys(taskListData).length
    //   if (Object.keys(taskListData).length == 0) {
    //     this.taskErrorMsg = true;
    //     this.groupTaskList;
    //   } else {
    //     this.isDisplayed = true;
    //     this.groupTaskList = taskListData.mastTaskList;
    //     if (this.groupTaskList == undefined) {
    //       this.groupTaskList;
    //       this.taskErrorMsg = true;
    //     } else {
    //       if (this.groupTaskList.length == 0) {
    //         this.taskErrorMsg = true;
    //       } else {
    //         this.taskErrorMsg = false;
    //       }
    //     }
    //   }
    // });

    this.masterTaskId = localStorage.getItem('masterTaskId')
    this.currenTask = this.masterTaskId ? this.masterTaskId : localStorage.getItem('masterTaskId');
  }

  frequencyDropdown(ev: MouseEvent) {
    ev.stopPropagation();
  }
  userDropDown(ev: MouseEvent) {
    ev.stopPropagation();
  }

  masterTaskUpdateByFrequency(event, rowData) {
    let masterGroupId = localStorage.getItem('masterGroupId');
    if (event.name == "" || event.name == null || event.name == undefined) {
      return false;
    }
    let updateData = {
      groupId: masterGroupId,
      taskDescription: rowData.taskDescription,
      taskAssignTo: rowData.taskAssignTo,
      frequency: event.name,
      recurringEndDate: rowData.recurringEndDate,
      dueDay: rowData.dueDay,
      taskStatus: ""
    }
    this.todoTaskService.updateMasterTask(rowData.masterTaskId, updateData).subscribe((res) => {
      if (res.status === false) {
      } else {
        if (res.status === 'success') {
          this.toastr.success('Success', res.message);

          let masterGroupId = localStorage.getItem('masterGroupId');
          let masterGroupName = localStorage.getItem('masterGroupName');
          let body = {
            groupName: masterGroupName,
            groupId: masterGroupId
          }
          this.dataService.setSessionData({
            sessionData: body
          });
        }
      }
    }, (error) => {
      this.toastr.error('Error', error);
    });

  }

  public taskUserChangeByUser(value: any, rowData) {
    let masterGroupId = localStorage.getItem('masterGroupId');

    if (value == null || value == undefined) {
      return false;
    }
    let updateData = {
      groupId: masterGroupId,
      taskDescription: rowData.taskDescription,
      taskAssignTo: value,
      frequency: rowData.frequency,
      recurringEndDate: rowData.recurringEndDate,
      dueDay: rowData.dueDay,
      taskStatus: ""
    }

    this.todoTaskService.updateMasterTask(rowData.masterTaskId, updateData).subscribe((res) => {
      if (res.status === false) {
      } else {
        if (res.status === 'success') {
          this.toastr.success('Success', res.message);
          let masterGroupId = localStorage.getItem('masterGroupId');
          let masterGroupName = localStorage.getItem('masterGroupName');
          let body = {
            groupName: masterGroupName,
            groupId: masterGroupId
          }
          this.dataService.setSessionData({
            sessionData: body
          });
        }
      }
    }, (error) => {
      this.toastr.error('Error', error);

    });
  }

  taskFrequencyChange(value) {
    this.selectedFrequency = value.frequency;
  }

  taskUserChange(value) {
    this.selectedUser = value.taskAssignTo;
  }

  public taskUserupdateByDueDate(type: string, event: MatDatepickerInputEvent<Date>, rowData) {
    let recurringEndDate = this.datepipe.transform(event.value, 'yyyy-MM-dd');
    if (recurringEndDate == null || recurringEndDate == undefined) {
      return false;
    }
    let masterGroupId = localStorage.getItem('masterGroupId');
    // let masterTaskId = localStorage.getItem('masterTaskId');
    let updateData = {
      groupId: masterGroupId,
      taskDescription: rowData.taskDescription,
      taskAssignTo: rowData.taskAssignTo,
      frequency: rowData.frequency,
      recurringEndDate: recurringEndDate,
      dueDay: rowData.dueDay,
      taskStatus: ""
    }

    this.todoTaskService.updateMasterTask(rowData.masterTaskId, updateData).subscribe((res) => {
      if (res.status === false) {
      } else {
        if (res.status === 'success') {
          this.toastr.success('Success', res.message);
          let masterGroupId = localStorage.getItem('masterGroupId');
          let masterGroupName = localStorage.getItem('masterGroupName');
          let body = {
            groupName: masterGroupName,
            groupId: masterGroupId
          }
          this.dataService.setSessionData({
            sessionData: body
          });
        }
      }
    }, (error) => {
      this.toastr.error('Error', error);
    });
  }

  public currenTask;
  getMasterTaskDetails(masterTaskId) {
    localStorage.setItem('masterTaskId', masterTaskId);
    this.currenTask = masterTaskId ? masterTaskId : localStorage.getItem('masterTaskId');
    if (masterTaskId != null || masterTaskId != undefined) {
      this.dataService.setTaskId({
        taskId: masterTaskId,
        editTask: true
      });
    }
  }

  getMasterTaskId(masterTaskId) {
    if (masterTaskId != null || masterTaskId != undefined || masterTaskId != "")
      this.todoTaskService.getMasterTaskDetailsById(masterTaskId).subscribe((res) => {
        if (res) {
          this.masterTaskDetails = res;
        }
        const dialogRef = this.dialog.open(MasterTodoDialogComponent, {
          width: '740px',
          height: 'auto',
          backdropClass: 'custom-dialog-backdrop-class',
          panelClass: 'custom-dialog-panel-class',
          data: { pageValue: this.masterTaskDetails }
        });

        dialogRef.afterClosed().subscribe(result => {
        });
      }, (error) => {

      });
  }
  add3Dots(string, limit) {
    var dots = "....";
    if (string.length > limit) {
      // you can also use substr instead of substring
      string = string.substring(0, limit) + dots;
    }
    return string;
  }

  deleteMasterTask(masterTaskId) {
    const message = `Are you sure, you want to delete this recursive task?`;
    const dialogData = new ConfirmDialogModel("Confirm Action", message);
    const dialogRef = this.dialog.open(ConfirmComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        if (masterTaskId != null || masterTaskId != undefined) {
          this.todoTaskService.deleteMasterTask(masterTaskId).subscribe((res) => {
            if (res.status === false) {
              this.toastr.error('error', res.message);
            } else {
              if (res.status === 'success') {
                this.toastr.success('Success', res.message);

                let masterGroupId = localStorage.getItem('masterGroupId');
                let masterGroupName = localStorage.getItem('masterGroupName');
                let body = {
                  groupName: masterGroupName,
                  groupId: masterGroupId
                }
                this.dataService.setSessionData({
                  sessionData: body
                });
              }
            }
          }, (error) => {
            this.toastr.error('Error', error);
            // if ((error) === "Token Expired") {
            //   this.router.navigate(['/']);
            // }
          });
        }
      }
    });
  }

  ngOnDestroy(): void {
    // this.ngUnsubscribe.next(null);
    // this.ngUnsubscribe.complete();
    // this.destroyVal.next();
    // this.destroyVal.complete();
  }
}
