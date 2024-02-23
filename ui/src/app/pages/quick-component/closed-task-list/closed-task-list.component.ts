import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Task } from '../task-list/task';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { TodoTaskService } from '../../../_services/todo-task.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '../../../_services/alert.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { DatePipe, formatDate } from '@angular/common';
import { MustMatch, isArrayOfEmails, isEmail, validateEmailAddress } from '../../../_helpers/must-match.validator';
import { AdduserComponent } from '../../../pages/dialog/adduser.component';
import { NewGroupUserComponent } from '../../../pages/dialog/new-group-user.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../pages/dialog/confirm-dialog.component';
import { TodoDialogComponent } from '../../../pages/dialog/todo-dialog.component';
import { AddtaskDialogComponent } from '../../../pages/dialog/addtask-dialog.component';
import { AddtextcopyDialogComponent } from '../../../pages/dialog/addtextcopy-dialog.component';
import { DialogService } from '../../../_services/dialog.service';
import { Subject } from 'rxjs';
import { LoaderService } from '../../../_services/loader.service';
import { OverlayService } from '../../../_services/overlay.service';
import { ConfirmDialog2Component } from '../../../pages/dialog/confirm-dialog2.component';
import { NgSelectComponent } from '@ng-select/ng-select';
import { MatMenuTrigger } from '@angular/material/menu';
import { ConfirmComponent, ConfirmDialogModel } from '../../../pages/dialog/confirm.component';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { TooltipPosition } from '@angular/material/tooltip';
import { CustomValidator } from '../../../_helpers/custom.validator';
import { TourService } from 'ngx-tour-md-menu';
import { EditTaskDialogComponent } from '../../../pages/dialog/task-edit-dialog/edittask-dialog.component';
import { SpinnerService } from '../../../_services/spinner.service';

@Component({
  selector: 'app-closed-task-list',
  templateUrl: './closed-task-list.component.html',
  styleUrls: ['./closed-task-list.component.css']
})
export class ClosedTaskListComponent implements OnInit {
  isDisplayed = true;
  @Output() sendTaskList: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  groupByTask = [];
  @Input() t: Task;
  selectedStatus: any;
  dataList = [];
  items = [];
  groupMemberData = [];
  taskDetailsData = [];
  selectedUser: any;
  groupTaskList: any = [];
  newMembers = [];
  visible: boolean = true;
  submitted: boolean;
  ownerUserList = [];
  isChecked = false;
  currentGroupId: any;
  isOwner = false;
  tooltipDueDate: any;
  quickSpinner = false;
  tooltipUserName: any;
  tooltipTaskStatus: any;
  constructor(private fb: FormBuilder,
    private todoTaskService: TodoTaskService,
    private toastr: ToastrService,
    private alertService: AlertService,
    private _snackBar: MatSnackBar,
    public datepipe: DatePipe,
    private cdref: ChangeDetectorRef,
    public dialog: MatDialog,
    private dialogService: DialogService,
    private loader: LoaderService,
    private overlayService: OverlayService,
    // private seo: SeoService,
    private router: Router,
    private readonly tourService: TourService,
    public spinnerService:SpinnerService) {
      this.dataList = [
        { id: 1, name: "Re-open task" },
        { id: 3, name: "Done" }
      ]
    }

    ngOnInit(): void {
    }
    add3Dots(string, limit) {
      var dots = "....";
      if (string.length > limit) {
        // you can also use substr instead of substring
        string = string.substring(0, limit) + dots;
      }
      return string;
    }
    taskStatusValue(value) {
      this.selectedStatus = value.taskStatus;
    }

    cancelRemoveClick(ev: MouseEvent) {
      ev.stopPropagation();
    }
    getTaskStatusValue(event, rowData) {
      let data = {
        taskStatus: 'Open'
      }
      this.todoTaskService.updateTaskStatus(rowData.taskId, data).subscribe((res) => {
        if (res.status === false) {
        } else {
          if (res.status === 'success') {
            this.toastr.success('Success', res.message);
            let getGroupId = localStorage.getItem('groupId');
            let groupName = localStorage.getItem('groupName');
            let isGroupAdmin = localStorage.getItem('isGroupAdmin');
            this.getGroupdeatils(groupName, getGroupId, isGroupAdmin)
          }
        }
      }, (error) => {
        this.alertService.error(error);
        if ((error) === "Token Expired") {
          this.router.navigate(['/']);
        }
      });
    }



    getNewMembersList(groupId) {
      if (groupId == null || groupId == undefined || groupId == "") {
        return;
      } else {
        this.todoTaskService.getNewMembersList(groupId).subscribe((res) => {
          this.newMembers = res.newMembers;
        }, (error) => {
          this.alertService.error(error);
          // this.toastr.error('Error', error);
          if ((error) === "Token Expired") {
            this.router.navigate(['/']);
          }
        });
      }
    }

    getGroupMembers(groupId) {
      if (groupId == null || groupId == undefined || groupId == "") {
        return;
      } else {
        this.todoTaskService.getGroupMembers(groupId).subscribe((res) => {
          this.groupMemberData = res.groupMembers;
          var textUser = new Array();
          for (let i = 0; i < this.groupMemberData.length; i++) {
            textUser.push({ tag: this.groupMemberData[i].userEmail, display: this.groupMemberData[i].userEmail })
          }
          this.items = textUser
        }, (error) => {
          this.alertService.error(error);
          // this.toastr.error('Error', error);
          if ((error) === "Token Expired") {
            this.router.navigate(['/']);
          }
        });
      }
    }



    public currentGroup;
    getGroupdeatils(groupName, groupId, isGroupAdmin) {
      // this.getGroupOwnerList(groupId)
      // this.getGroupById(groupId);
      if (groupId) {
        this.currentGroup = groupId;
      } else {
        this.currentGroup = this.currentGroupId;
      }
      localStorage.setItem('groupId', groupId);
      localStorage.setItem('groupName', groupName);
      localStorage.setItem('isGroupAdmin', isGroupAdmin);
      this.todoTaskService.getGroupTaskList(groupId).subscribe((res) => {
        if (res.status === false) {
        } else {
          this.getGroupMembers(groupId)
          this.getNewMembersList(groupId);
          this.groupTaskList = res.taskList;
          this.sendTaskList.emit(this.groupTaskList);
        }
      }, (error) => {
        // this.loading = false;
        if ((error) === "Token Expired") {
          this.router.navigate(['/']);
        }
      });
    }





    getUserDetails(t) {
      this.visible = this.visible ? false : true;
      // this.buttonTitle = this.visible?"Hide":"Show";
    }
    hideUserDetails() {
      this.visible = this.visible ? false : false;
    }
    taskUserChange(value) {
      let getGroupId = localStorage.getItem('groupId');
      this.getGroupMembers(getGroupId);
      if (value.taskAssignTo == null) {
        this.selectedUser = "";
      } else {
        this.selectedUser = value.taskAssignTo;
      }
    }

    // ngAfterContentChecked() {
    //   this.cdref.detectChanges();
    // }
    getDueDateTooltip(taskRow): string {
      return this.tooltipDueDate = this.datepipe.transform(taskRow.taskDueDate, 'MMM d, y');
    }

    getUserNameTooltip(taskRow): string {
      return this.tooltipUserName = taskRow.userDetails.userName;
    }
    getStatusTooltip(taskRow): string {
      return this.tooltipTaskStatus = taskRow.taskStatus;
    }

    editTaskDialog(taskRow) {
      // var spinnerRef = this.spinnerService.start();
      const dialogRef = this.dialog.open(EditTaskDialogComponent, {
        width: '812px',
        maxHeight: '580px',
        backdropClass: 'custom-dialog-backdrop-class',
        panelClass: 'custom-dialog-panel-class',
        data: { taskDetails: taskRow, groupMembers: this.groupMemberData }
      });
      // this.spinnerService.stop(spinnerRef);
      dialogRef.afterClosed().subscribe(result => {
        if (!result) {
          return
        } else {
          let isGroupAdmin = localStorage.getItem('isGroupAdmin');
          this.getGroupdeatils(result.groupName, result.groupId, isGroupAdmin);
        }
      });
    }
  }
