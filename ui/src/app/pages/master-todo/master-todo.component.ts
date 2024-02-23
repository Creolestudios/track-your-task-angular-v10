import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TodoTaskService } from '../../_services/todo-task.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SeoService } from '../../_services/seo.service';
import { ToastrService } from 'ngx-toastr';
import { MasterTodoDialogComponent } from './../dialog/master-todo-dialog.component'
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ConfirmComponent, ConfirmDialogModel } from '../../pages/dialog/confirm.component';
import { AddMasterTaskDialogComponent } from '../dialog/master-task/addmastertask-dialog.component';
import { EditMasterDialogComponent } from '../dialog/master-edit-dialog/editmaster-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-master-todo',
  templateUrl: './master-todo.component.html',
  styleUrls: ['./master-todo.component.css']
})
export class MasterTodoComponent implements OnInit {
  AddMasterTaskForm: FormGroup;
  EditMasterTaskForm: FormGroup;
  masterTaskData: any = [];
  submitted = false;
  dueDays: string;
  checkAssignUserValue: any;
  GroupData: any = [];
  buttonName = 'Show';
  groupMemberData: any = [];
  collection = { data: [] };
  systemSettingList: any = [];
  AddTaskForm: FormGroup;
  userErrorMsg: string
  SearchGroup = false;
  groupTaskList = [];
  currentGroupId: any;
  groupName;
  CurrentGroupName: string;
  isFavoriteGroup: boolean = true;
  isDisplayed = false;
  taskErrorMsg: any;
  editTaskComponent = false;
  AddTaskComponent = false;
  selectedUser: any;
  masterTaskDetails: any;
  selectedFrequency: any;
  FrequencydataList = [];
  taskUpdateSubmitted = false;
  editDueDays: string;
  masterTaskId: string;
  loadingBtn = false;
  tooltipDueDate: any;
  tooltipUserName: string;
  globalSelectedGroup: string;
  masterTaskShowMoreTaskList = 10;
  todayDate:any;

  constructor(
    private todoTaskService: TodoTaskService,
    public datepipe: DatePipe,
    private fb: FormBuilder,
    private router: Router,
    private seo: SeoService,
    private toastr: ToastrService,
    private cdref: ChangeDetectorRef,
    public dialog: MatDialog) {

    this.seo.setTags({
      title: 'Recursive  Task', // Title
      titleSuffix: '- track2excel', // Title Suffix
      description: 'Recursive  Task', // Description
      image: '', // Image
      keywords: 'Recursive Task, Recursive Task management' // Keywords
    });

    // this.CurrentGroupName = localStorage.getItem('masterGroupName');
    // $('#groupNameId').html(this.CurrentGroupName);
    let todayDate  = new Date()
    this.todayDate = moment(todayDate).format('YYYY-MM-DD');
  }

  ngOnInit(): void {
    this.EditMasterTaskForm = this.fb.group({
      taskAssignTo: [null],
      dueDay: ['', [Validators.required]],
      taskDescription: ['', [Validators.required]],
      frequency: ['', [Validators.required]],
      recurringEndDate: ['']
    });

    this.AddMasterTaskForm = this.fb.group({
      taskAssignTo: [null],
      dueDay: ['', [Validators.required]],
      taskDescription: ['', [Validators.required]],
      frequency: [null, [Validators.required]],
      recurringEndDate: ['']
    });

    setTimeout(() => {
      this.CurrentGroupName = localStorage.getItem('masterGroupName');
      let currentGroupId = localStorage.getItem('masterGroupId');
      // $('#groupNameId').html(this.CurrentGroupName);
      if (currentGroupId != null || this.currentGroupId != undefined) {
        this.activateClass(currentGroupId);
        $('#groupNameId').html(this.CurrentGroupName);
        this.getGroupdeatils(this.CurrentGroupName, currentGroupId);
        this.globalSelectedGroup = this.CurrentGroupName;
        this.AddTaskComponent = true;
      }
    }, 1000);
    this.AddTaskForm = this.fb.group({
      groupName: [''],
      userId: [null],
      taskDescription: ['', [Validators.required]],
      taskDueDate: [''],
    });
    this.getGroupList()
    this.FrequencydataList = [
      { id: 1, name: "Daily" },
      { id: 2, name: "Weekly" },
      { id: 3, name: "Monthly" }
    ]
    this.masterTaskId = localStorage.getItem('masterTaskId')
    this.currenTask = this.masterTaskId ? this.masterTaskId : localStorage.getItem('masterTaskId');
  }

  groupSearchToggle() {
    this.SearchGroup = !this.SearchGroup
    if (this.SearchGroup) {
      this.buttonName = 'Hide';
    }
    else {
      this.buttonName = 'Show'
    }
  }

  getGroupList() {
    this.todoTaskService.getGroupList().subscribe((res) => {
      this.GroupData = res.groups;
      var getGroupCount = window.sessionStorage.getItem("masterloadCount");
      if (getGroupCount == "masteerGroupCount") {
        return
      } else {
        for (let i = 0; i < this.GroupData.length; i++) {
          if (this.GroupData[i].isFavoriteGroup == true) {
            localStorage.setItem('masterGroupId', this.GroupData[i].groupId);
            localStorage.setItem('masterGroupName', this.GroupData[i].groupName);
            window.sessionStorage.setItem("masterloadCount", "masteerGroupCount");
          } else {
            this.GroupData = res.groups;
          }
        }
      }
    }, (error) => {
    });
  }



  onDueDaysEvent(event) {
    if (event.target.value != "") {
      if ((event.target.value) > 365) {
        this.dueDays = "Due days should not greater than 365 days";
        return
      } else {
        this.dueDays = "";
      }
    } else {
      this.dueDays = "Due days in numbers is required";
    }
  }

  onEditDueDaysEvent(event) {
    if (event.target.value != "") {
      if ((event.target.value) > 365) {
        this.editDueDays = "Due days should not greater than 365 days";
        return
      } else {
        this.editDueDays = "";
      }
    } else {
      this.editDueDays = "Due days in numbers is required";
    }
  }

  public currenTask;
  getMasterTaskDetails(masterTaskId) {
    localStorage.setItem('masterTaskId', masterTaskId);
    this.currenTask = masterTaskId ? masterTaskId : localStorage.getItem('masterTaskId');
    if (masterTaskId != null || masterTaskId != undefined) {
      this.editTaskComponent = true;
      this.AddTaskComponent = false;
      this.dueDays = "";
      this.submitted = false;
    } else {
      this.editTaskComponent = false;
      this.AddTaskComponent = true;
    }
    if (masterTaskId != null || masterTaskId != undefined) {
      this.todoTaskService.getMasterTask(masterTaskId).subscribe((res) => {
        this.masterTaskData = res;
        if (this.groupMemberData == undefined) {
        } else {
          this.groupMemberData;
          for (let i = 0; i < this.groupMemberData.length; i++) {
            if (this.masterTaskData.taskAssignTo === this.groupMemberData[i].userId) {
              this.checkAssignUserValue = this.masterTaskData.taskAssignTo; break;
            } else {
              this.checkAssignUserValue = null;
            }
          }
          if (this.checkAssignUserValue == null) {
            let EditData = {
              dueDay: this.masterTaskData.dueDay,
              taskDescription: this.masterTaskData.taskDescription,
              taskAssignTo: this.checkAssignUserValue,
              taskDueDate: this.masterTaskData.taskDueDate,
              frequency: this.masterTaskData.frequency,
              recurringEndDate: this.masterTaskData.recurringEndDate
            }
            this.EditMasterTaskForm.patchValue(EditData);
          } else {
            let EditData = {
              dueDay: this.masterTaskData.dueDay,
              taskDescription: this.masterTaskData.taskDescription,
              taskAssignTo: this.checkAssignUserValue,
              taskDueDate: this.masterTaskData.taskDueDate,
              frequency: this.masterTaskData.frequency,
              recurringEndDate: this.masterTaskData.recurringEndDate
            }
            this.EditMasterTaskForm.patchValue(EditData);
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
                this.getGroupdeatils(masterGroupName, masterGroupId)
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
          this.getGroupdeatils(masterGroupName, masterGroupId)
        }
      }
    }, (error) => {
      this.toastr.error('Error', error);
    });
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
          this.getGroupdeatils(masterGroupName, masterGroupId)
        }
      }
    }, (error) => {
      this.toastr.error('Error', error);
    });

  }
  taskFrequencyChange(value) {
    this.selectedFrequency = value.frequency;
  }

  frequencyDropdown(ev: MouseEvent) {
    ev.stopPropagation();
  }


  editTaskCancel() {
    this.AddTaskComponent = true;
    this.editTaskComponent = false;
    this.AddMasterTaskForm.reset();
    this.submitted = false;
    this.taskUpdateSubmitted = false;
    this.EditMasterTaskForm.reset();
  }
  // addFormClear() {
  //   this.AddMasterTaskForm.reset();
  //   this.submitted = false;
  //   this.dueDays = "";
  // }

  get m() { return this.EditMasterTaskForm.controls; }
  updateMasterTask(EditMasterTaskForm) {
    let masterTaskId = localStorage.getItem('masterTaskId');
    let masterGroupId = localStorage.getItem('masterGroupId');
    this.taskUpdateSubmitted = true;
    if (this.EditMasterTaskForm.value.dueDay == "" || this.EditMasterTaskForm.value.dueDay == null) {
      this.editDueDays = "Due days in numbers is required";
      return;
    } else {
      this.editDueDays = "";
    }
    if ((this.EditMasterTaskForm.value.dueDay) > 365) {
      return
    }
    let recurringEndDate = this.datepipe.transform(EditMasterTaskForm.value.recurringEndDate, 'yyyy-MM-dd');
    let createData = {
      groupId: masterGroupId,
      taskDescription: EditMasterTaskForm.value.taskDescription,
      taskAssignTo: EditMasterTaskForm.value.taskAssignTo,
      frequency: EditMasterTaskForm.value.frequency,
      recurringEndDate: recurringEndDate,
      dueDay: EditMasterTaskForm.value.dueDay,
      taskStatus: ""
    }

    if (EditMasterTaskForm.value.taskDescription == "" || EditMasterTaskForm.value.taskDescription == null ||
      EditMasterTaskForm.value.frequency == null || EditMasterTaskForm.value.frequency == ""
      || EditMasterTaskForm.value.dueDay == null || EditMasterTaskForm.value.dueDay == "") {
      return false;
    }

    this.todoTaskService.updateMasterTask(masterTaskId, createData).subscribe((res) => {
      if (res.status === false) {
      } else {
        if (res.status === 'success') {
          this.toastr.success('Success', res.message);
          // let masterGroupId = localStorage.getItem('masterGroupId');
          // let masterGroupName = localStorage.getItem('masterGroupName');
          this.AddTaskComponent = true;
          this.AddMasterTaskForm.reset();
          this.taskUpdateSubmitted = false;
          this.editTaskComponent = false;
          // this.AddTaskComponent = false;
          let masterGroupId = localStorage.getItem('masterGroupId');
          let masterGroupName = localStorage.getItem('masterGroupName');
          this.getGroupdeatils(masterGroupName, masterGroupId)
          this.dueDays = "";
        }
      }
    }, (error) => {
      this.toastr.error('Error', error);
    });
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
  getGroupMembers(groupId) {
    if (groupId == null || groupId == undefined) {
      return false;
    }
    this.todoTaskService.getGroupMembers(groupId).subscribe((res) => {
      this.groupMemberData = res.groupMembers;
    }, (error) => {
    });
  }

  taskUserChange(value) {
    this.selectedUser = value.taskAssignTo;
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
          this.getGroupdeatils(masterGroupName, masterGroupId)
        }
      }
    }, (error) => {
      this.toastr.error('Error', error);

    });
  }
  public activateClass(index: any) {
    if (index) {
      this.currentGroup = index;
    } else {
      this.currentGroup = this.currentGroupId;
    }
  }
  userDropDown(ev: MouseEvent) {
    ev.stopPropagation();
  }
  add3Dots(string, limit) {
    var dots = "....";
    if (string.length > limit) {
      // you can also use substr instead of substring
      string = string.substring(0, limit) + dots;
    }
    return string;
  }
  public currentGroup;
  getGroupdeatils(groupName, groupId) {
    this.isDisplayed = true;
    // $('#groupNameId').html(groupName ? groupName : this.CurrentGroupName)
    if (groupId == null || groupId == undefined) {
      return false;
    } else {
      localStorage.setItem('masterGroupId', groupId);
      localStorage.setItem('masterGroupName', groupName);
      // this.AddTaskComponent = true;
    }
    this.SearchGroup = false;
    if (groupId) {
      this.currentGroup = groupId;
    } else {
      this.currentGroup = this.currentGroupId;
    }
    this.getGroupMembers(groupId);
    this.globalSelectedGroup = groupName
    this.todoTaskService.getGroupMasterTaskList(groupId).subscribe((res) => {
      if (res.masterTaskList.length == 0) {
        this.taskErrorMsg = true;
        this.groupTaskList = [];
      } else {
        this.taskErrorMsg = false;
        this.groupTaskList = res.masterTaskList;
        this.masterTaskShowMoreTaskList = 10
      }
      localStorage.setItem('masterGroupId', groupId);
      localStorage.setItem('masterGroupName', groupName);
      // $('#groupNameId').html(groupName ? groupName : this.CurrentGroupName)
    }, (error) => {
      // this.loading = false;
      if ((error) === "Token Expired") {
        this.router.navigate(['/']);
      }
    });
  }

  addTask() {
    const dialogRef = this.dialog.open(AddMasterTaskDialogComponent, {
      width: '512px',
      maxHeight: '480px',
      position: {
        bottom: '3%',
        right: '0px',
      },
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: ["animate__animated", "animate__slideInRight"],
      data: { groupList: this.GroupData }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return
      } else {
        this.getGroupdeatils(result.masterGroupName, result.masterGroupId)
      }
    });
  }
  getGroupFromDropDown(event) {
    if (!event) {
      return
    }
    this.getGroupdeatils(event.groupName, event.groupId);
    this.globalSelectedGroup = event.groupName;
  }
  cancelClick(ev: MouseEvent) {
    ev.stopPropagation();
  }
  cancelRemoveClick(ev: MouseEvent) {
    ev.stopPropagation();
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  getDueDateTooltip(taskRow): string {
    return this.tooltipDueDate = this.datepipe.transform(taskRow.taskDueDate, 'MMM d, y');
  }

  getUserNameTooltip(taskRow): string {
    return this.tooltipUserName = taskRow.userDetails.userName;
  }

  openEditMasterPanel(taskRow) {
    const dialogRef = this.dialog.open(EditMasterDialogComponent, {
      width: '812px',
      maxHeight: '580px',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: 'custom-dialog-panel-class',
      data: { masterTaskRow: taskRow, groupMembers: this.groupMemberData }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return
      } else {
        this.getGroupdeatils(result.masterGroupName, result.masterGroupId)
      }
    });
  }
  masterTaskShowMoreTask() {
    this.masterTaskShowMoreTaskList += 5
  }

}
