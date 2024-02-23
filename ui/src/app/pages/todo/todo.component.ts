import {
  Component,
  TemplateRef,
  ChangeDetectorRef,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnInit,
  HostListener,
  Input,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { concatMap, first, takeWhile } from 'rxjs/operators';
import { TodoTaskService } from '../../_services/todo-task.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '../../_services/alert.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { DatePipe, formatDate } from '@angular/common';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import {
  MustMatch,
  isArrayOfEmails,
  isEmail,
  validateEmailAddress,
} from '../../_helpers/must-match.validator';
import { AdduserComponent } from '../../pages/dialog/adduser.component';
import { NewGroupUserComponent } from '../../pages/dialog/new-group-user.component';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig,
} from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../pages/dialog/confirm-dialog.component';
import { TodoDialogComponent } from '../../pages/dialog/todo-dialog.component';
import { AddtaskDialogComponent } from '../../pages/dialog/addtask-dialog.component';
import { AddtextcopyDialogComponent } from '../../pages/dialog/addtextcopy-dialog.component';
import { DialogService } from '../../_services/dialog.service';
import { from, Subject } from 'rxjs';
import { LoaderService } from '../../_services/loader.service';
import { OverlayService } from '../../_services/overlay.service';
import { ConfirmDialog2Component } from '../../pages/dialog/confirm-dialog2.component';
import { NgSelectComponent } from '@ng-select/ng-select';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { Meta, Title } from '@angular/platform-browser';
import { SeoService } from '../../_services/seo.service';
import {
  ConfirmComponent,
  ConfirmDialogModel,
} from '../../pages/dialog/confirm.component';
import {
  MatDatepicker,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { TooltipPosition } from '@angular/material/tooltip';
import { CustomValidator } from '../../_helpers/custom.validator';
import { TourService } from 'ngx-tour-md-menu';
import { DataService } from './../../_services/data.service';
import { EditTaskDialogComponent } from '../dialog/task-edit-dialog/edittask-dialog.component';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import * as $ from 'jquery';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CommentDialogComponent } from '../dialog/comment-dialog/comment-dialog.component';

interface IUsers {
  userId: string;
  userEmail: string;
  userName: string;
}
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class TodoComponent implements OnInit {
  filterId = [];
  showFiller = false;
  isOpened = false;
  positionOptions: TooltipPosition[] = [
    'after',
    'before',
    'above',
    'below',
    'left',
    'right',
  ];
  position = new FormControl(this.positionOptions[0]);
  breakpoint: number;
  typesOfShoes: string[] = [
    'Boots',
    'Clogs',
    'Loafers',
    'Moccasins',
    'Sneakers',
  ];
  SearchGroup = false;
  AddGroup = false;
  taskSearchTab = false;
  taskSection = false;
  isOpen = false;
  isTask = false;
  loadingBtn = false;
  isHeOwner: boolean = false;
  taskSearchFilter = false;
  ShowAllSearchTab = false;
  onMouseOver = false;
  // NewAddGroupMember = false;
  removeUserFromGroup = false;
  buttonName = 'Show';
  hide: any;
  AddGroupForm: FormGroup;
  // AddTaskForm: FormGroup;
  EditTaskForm: FormGroup;
  filterTaskListForm: FormGroup;
  filterModel: FormGroup;
  addGroupNewMembersForm: FormGroup;
  textToTextForm: FormGroup;
  loading;
  isFavoriteGroup: boolean = true;
  selectedStatus: any;
  GroupData: any = [];
  ownerUserList: any = [];
  userSelectedForAdmin: any = [];
  groupName = '';
  oldGroupList = [];
  toastRef;
  groupTaskList: any = [];
  isDisplayed = false;
  allMembersData: Array<IUsers> = [];
  taskData: any = [];
  selectedIndex: number = null;
  active: boolean = false;
  subModule: Boolean = false;
  UserCount: number;
  taskSearch;
  InProgressFileter = false;
  OpenFilter = false;
  DoneFilter = false;
  groupSubmitted: boolean = false;
  submitted: boolean = false;
  taskUpdateSubmitted: boolean = false;
  textCopyPanel = false;
  isMarkMyTask = false;
  TodayDate = new Date();

  @ViewChild('myimg') elementView: ElementRef;
  @ViewChildren('checkboxes') checkboxes: QueryList<ElementRef>;
  @ViewChild('menu2') matMenuElement: MatMenuTrigger;
  @ViewChild(MatMenuTrigger, { static: false }) matMenuTrigger: MatMenuTrigger;
  @ViewChild(NgSelectComponent) ngSelectView: NgSelectComponent;

  groupId: string;
  taskDueDate: Date;
  groupMemberData: any;
  userErrorMsg: string = '';
  errorMsg: string;
  taskCurrentStatus: any;
  editGroupName: any;
  newMembers: any = [];
  result: boolean;
  error: any;
  checkuserValue: any;
  groupNameLable: string;
  isEmailPreference: boolean;
  dataListpipeFilteer: Array<any> = [];
  dataList: Array<any> = [];
  dataListSearchFilter: Array<any> = [];
  dataList2: Array<any> = [];
  editGroupForm: FormGroup;
  editForm = false;
  showMsg = false;
  btnDisabled = false;
  currentGroupId: any;
  @Input() pinStatus: boolean;
  position_stack = [];
  @ViewChild('groupSearchInput', { static: true }) groupSearchInput: ElementRef;
  userInvite: any[];
  systemSettingIcon = false;
  userRole: string;
  isAdmin: boolean = false;
  @ViewChild(MatMenuTrigger) ddTrigger: MatMenuTrigger;
  // @ViewChild(MatMenuTrigger)
  @ViewChild('selectRef') someRef: MatSelect;

  @ViewChild('menu2') selectedMenu2: MatSelect;

  @ViewChild('assignUser') userBack: ElementRef;

  isChecked = false;
  isPreferences: any;
  @ViewChild('toggleElement') ref: ElementRef;
  systemSettingList: any = [];
  collection = { data: [] };
  isGroupAdmin: string;
  selected: any;
  selected1: any;
  selectedgroupUser: any;
  selectedUser: any;
  // @ViewChild("textEduterValue", { static: true }) el;
  isOwner = false;
  isMaker = false;
  taskDetailsData: any;
  html = '';
  showMoreTaskList = 10;
  openShowMoreTaskList = 10;
  doneShowMoreTaskList = 10;
  inProgressShowMoreTaskList = 10;
  // showMasterTaskCheckbox = false;
  FrequencydataList: Array<any> = [];
  subscription: Subscription;
  // dueDays: string;
  // frequency: string;
  filterIcons = false;
  items: any[] = [];
  textTotextsubmitted = false;
  fileContent: any = '';
  @ViewChild('picker3') datePicker123: MatDatepicker<Date>;

  config = {
    height: 130,
    menubar: false,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount',
    ],
    toolbar:
      'undo redo | formatselect | ' +
      'bold italic backcolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat',
  };

  fileOutput: any;
  filType: any;
  mentionConfig: any;
  taskText: string;
  textNewLine: boolean;
  isLasTLogin: any;
  buttonTitle: string = 'Hide';
  visible: boolean = true;
  tooltipDueDateOpen: string;
  tooltipDueDateInprogress: string;
  tooltipDueDateDone: string;
  tooltipUserName: any;
  tooltipUserNameOpen: string;
  tooltipUserNameInprogress: string;
  tooltipUserNameDone: string;
  tooltipTaskStatusOpen: any;
  tooltipTaskStatusInprogress: any;
  tooltipTaskStatusDone: any;
  globalSelectedGroup: string;
  OpenTaskList = [];
  pre: string;
  InProgressTaskList = [];
  DoneTaskList = [];
  offsetFlag: boolean = true;
  navbarOpen = false;
  selectedFilterOptionOpen: any;
  selectedFilterOptionInprogress: any;
  selectedFilterOptionDone: any;
  tagFilterOptions1: boolean;
  tagFilterOptions2: boolean;
  tagFilterOptions3: boolean;
  tagFilterOptionsSortBy: boolean;
  searchTaskTerm;
  oldData: any;

  constructor(
    private fb: FormBuilder,
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
    private seo: SeoService,
    private router: Router,
    private readonly tourService: TourService
  ) {
    this.mentionConfig = {
      mentions: [
        {
          items: [
            {
              tag: '@a - Assignee (# will give you all the list of assignees)',
              display: '@a ',
              position: 5,
              type: 'operator',
            },
            {
              tag: '@d - Due date (Please enter in dd/mm/yyyy format)',
              display: '@d ',
              position: 1,
              type: 'operator',
            },
            {
              tag: '@e - End of task',
              display: '@e ',
              position: 5,
              type: 'operator',
            },
          ],
          labelKey: 'tag',
          triggerChar: '@',
          disableSort: true,
          mentionSelect: this.itemMentioned,
        },
        {
          items: this.items,
          labelKey: 'tag',
          triggerChar: '/',
          disableSort: true,
          mentionSelect: this.itemMentioned,
        },
      ],
    };

    this.seo.setTags({
      title: 'Todo Task', // Title
      titleSuffix: '- track2excel', // Title Suffix
      description: 'Todo Task', // Description
      image: '', // Image
      keywords: 'Task, Task management', // Keywords
    });

    this.taskDueDate = new Date();
    this.dataList = [
      { id: 1, name: 'Open' },
      { id: 2, name: 'In Progress' },
      { id: 3, name: 'Done' },
    ];
    this.dataListSearchFilter = [
      { id: 1, name: 'Open' },
      { id: 2, name: 'In Progress' },
      { id: 3, name: 'Done' },
    ];
    this.dataListpipeFilteer = [
      { id: 0, name: 'Open', model: 'OpenFilter', checked: false },
      {
        id: 1,
        name: 'In Progress',
        model: 'InProgressFileter',
        checked: false,
      },
      { id: 2, name: 'Done', model: 'DoneFilter', checked: false },
    ];

    this.FrequencydataList = [
      { id: 1, name: 'Daily' },
      { id: 2, name: 'Weekly' },
      { id: 3, name: 'Monthly' },
    ];

    let currentGroupId = localStorage.getItem('groupId');
    let groupName = localStorage.getItem('groupName');
    this.groupNameLable = groupName;
    this.isGroupAdmin = localStorage.getItem('isGroupAdmin');
    this.isPreferences = localStorage.getItem('isPreferences');
  }
  @HostListener('document:click', ['$event']) clickedOutside($event) {
    this.active = false;
  }

  ngOnInit(): void {
    this.groupName = '';
    $(document).ready(() => {
      $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        $(this).toggleClass('active');
      });
      $(document).ready(function () {
        console.log($('#venndb'));
      });
    });

    this.isLasTLogin = JSON.parse(
      sessionStorage.getItem('userData')
    ).isLastLogin;
    // if (this.isLasTLogin == true) {
    //   this.tourService.initialize([{
    //     anchorId: 'app-home',
    //     content: 'Please Create a group here to start application...',
    //     title: 'Add Group',
    //     route: 'todo-task'
    //   }, {
    //     anchorId: 'group-list',
    //     content: 'Once you add a group please select a group to add a task...',
    //     title: 'Select Group',
    //     route: 'todo-task'
    //   }, {
    //     anchorId: 'add-task',
    //     content: ' Add task with form and text with Recursive option...',
    //     title: 'Add Task',
    //     route: 'todo-task'
    //   },
    //   {
    //     anchorId: 'task-setting',
    //     content: 'Task menu have all setting and filter options...',
    //     title: 'Task Filter/Setting',
    //     route: 'todo-task'
    //   }, {
    //     anchorId: 'notify-seting',
    //     content: ' All groups and task-related notifications...',
    //     title: 'Notification',
    //     route: 'todo-task'
    //   }, {
    //     anchorId: 'app-welcome',
    //     content: ' Welcome to track2excel!...',
    //     title: 'Track2excel',
    //     route: 'todo-task'
    //   }]);
    //   this.tourService.start();
    // }

    this.getSystemSettingItems();
    this.isAdmin = JSON.parse(sessionStorage.getItem('userData')).isAdmin;
    this.userRole = JSON.parse(sessionStorage.getItem('userData')).role;

    this.filterModel = this.fb.group({
      open: [''],
      Progress: [''],
      done: [''],
    });

    this.addGroupNewMembersForm = this.fb.group({
      userEmail: [''],
    });

    this.AddGroupForm = this.fb.group({
      //Validators.required,CustomValidator.cannotContainSpace
      groupName: [
        '',
        [/*Validators.minLength(2),*/ CustomValidator.trimRequired],
      ],
      userEmail: [''],
    });

    this.filterTaskListForm = this.fb.group({
      groupId: [''],
      taskAssignTo: [''],
      taskDueDate: [''],
      taskStatus: [''],
    });

    this.EditTaskForm = this.fb.group({
      userId: [],
      taskDescription: ['', [Validators.required]],
      taskDueDate: [''],
    });
    this.textToTextForm = this.fb.group({
      taskText: ['', [Validators.required]],
    });
    let currentGroupId = localStorage.getItem('groupId');
    let groupName = localStorage.getItem('groupName');
    let taskId = localStorage.getItem('taskId');
    let taskStatus = localStorage.getItem('taskStatus');
    this.isGroupAdmin = localStorage.getItem('isGroupAdmin');
    this.getGroupById(localStorage.getItem('groupId'));

    this.groupNameLable = groupName;
    this.getGroupList();
    if (currentGroupId != null || this.currentGroupId != undefined) {
      this.activateClass(currentGroupId);
      this.globalSelectedGroup = groupName;
      $('#groupNameId').html(groupName);
    }
    this.getMembersList();
    if (taskStatus && taskId === null) {
      return;
    } else {
      // this.getTaskDetails(taskId, taskStatus);
    }
    // setTimeout(() => {
    // let currentGroupId = localStorage.getItem('groupId');
    // let groupName = localStorage.getItem('groupName');
    this.isGroupAdmin = localStorage.getItem('isGroupAdmin');

    if (groupName || this.currentGroupId != undefined) {
      this.getGroupdeatils(
        groupName,
        currentGroupId,
        JSON.parse(this.isGroupAdmin)
      );
      $('#groupNameId').html(groupName);
    } else {
      return;
    }
    if (JSON.parse(this.isGroupAdmin) === true) {
      this.systemSettingIcon = true;
    } else if (JSON.parse(this.isGroupAdmin) === false) {
      this.systemSettingIcon = false;
    }
  }
  toggleNavbar() {
    this.navbarOpen != this.navbarOpen;
  }
  @HostListener('window:scroll', ['$event']) getScrollHeight(event) {
    if (window.pageYOffset > 10) this.offsetFlag = false;
    else this.offsetFlag = true;
  }

  cancelClick(ev: MouseEvent) {
    ev.stopPropagation();
  }
  cancelRemoveClick(ev: MouseEvent) {
    ev.stopPropagation();
  }

  // onKey(value){
  //   if(!value){
  //     this.foods = this.oldData;
  //   }
  //   this.foods = this.searches(value);

  // }

  onKey(value) {
    if (!value) {
      this.groupMemberData = this.oldData;
    }
    this.groupMemberData = this.searches(value);
  }
  searches(value: string) {
    this.groupMemberData = this.oldData;
    let filter: string = value.toLowerCase();
    return this.groupMemberData.filter((option: any) =>
      option.userName.toLowerCase().includes(filter)
    );
  }

  clearGroupName() {
    this.groupName = '';
    this.GroupData = this.oldGroupList;
  }

  onResize(event) {
    this.breakpoint = event.target.innerWidth <= 400 ? 1 : 2;
  }
  getSystemSettingItems() {
    this.todoTaskService.getSystemSettingList().subscribe(
      (res) => {
        this.systemSettingList = res.systemSettings;
        var systemSettingsDataArray = [];
        for (var i = 0; i < this.systemSettingList.length; i++) {
          for (
            var j = 0;
            j < this.systemSettingList[i].systemSettingsData.length;
            j++
          ) {
            systemSettingsDataArray.push({
              systemSettingsName:
                this.systemSettingList[i].systemSettingsData[j]
                  .systemSettingsName,
              systemSettingsValue:
                this.systemSettingList[i].systemSettingsData[j]
                  .systemSettingsValue,
            });
            this.collection.data.push({
              emailpreferences: this.systemSettingList[i].systemSettingsType,
              systemSettingsData: systemSettingsDataArray,
            });
            this.isChecked =
              this.systemSettingList[i].systemSettingsData[
                j
              ].systemSettingsValue;
          }
        }
      },
      (error) => {
        this.alertService.error(error);
        if (error === 'Token Expired') {
          this.router.navigate(['/']);
        }
      }
    );
  }

  getGroupById(groupId) {
    if (groupId == null) {
      return;
    }
    this.todoTaskService.getGroupDetails(groupId).subscribe(
      (res) => {
        let isEmailPreference = res.isEmailPreference;
        this.isChecked = isEmailPreference;
      },
      (error) => {
        if (error === 'Token Expired') {
          this.router.navigate(['/']);
        }
      }
    );
  }

  onChange(event) {
    if ((event = true)) {
      this.isChecked;
      let groupId = localStorage.getItem('groupId');
      let addSetting = {
        isEmailPreference: this.isChecked,
      };
      this.todoTaskService.updateEmailSetting(addSetting, groupId).subscribe(
        (res) => {
          if (res.status === false) {
          } else {
            if (res.status === 'success') {
              this.toastr.success('Success', res.message);
            }
          }
        },
        (error) => {
          this.toastr.error('Error', error);
          if (error === 'Token Expired') {
            this.router.navigate(['/']);
          }
        }
      );
    } else {
      this.isChecked = false;
      let groupId = localStorage.getItem('groupId');
      let addSetting = {
        isEmailPreference: this.isChecked,
      };
      this.todoTaskService.updateEmailSetting(addSetting, groupId).subscribe(
        (res) => {
          if (res.status === false) {
          } else {
            if (res.status === 'success') {
              this.toastr.success('Success', res.message);
            }
          }
        },
        (error) => {
          this.toastr.error('Error', error);
          if (error === 'Token Expired') {
            this.router.navigate(['/']);
          }
        }
      );
    }
  }

  groupSearchToggle() {
    this.SearchGroup = !this.SearchGroup;
    if (this.SearchGroup) {
      this.buttonName = 'Hide';
      this.AddGroup = false;
    } else {
      this.buttonName = 'Show';
    }
  }

  addGrouptoggle() {
    this.AddGroup = !this.AddGroup;
    if (this.AddGroup) {
      this.buttonName = 'Hide';
      this.SearchGroup = false;
      this.editForm = false;
    } else {
      this.buttonName = 'Show';
    }
  }

  groupListSort() {
    if (!this.groupName) {
      this.GroupData = this.oldGroupList;
    }
    this.GroupData = this.searchGroupList(this.groupName);
  }
  //clearGroupName
  searchGroupList(value: string) {
    this.GroupData = this.oldGroupList;
    let filter: string = value.toLowerCase();
    return this.GroupData.filter((options: any) =>
      options.groupName.toLowerCase().includes(filter)
    );
  }

  searchTask() {
    this.taskSearchTab = !this.taskSearchTab;
    if (this.taskSearchTab) {
      this.buttonName = 'Hide';
      this.taskSearchFilter = false;
      this.ShowAllSearchTab = false;
      this.isDisplayed = true;
    } else {
      this.buttonName = 'Show';
    }
  }

  filterTask() {
    this.taskSearchFilter = !this.taskSearchFilter;
    if (this.taskSearchFilter) {
      this.buttonName = 'Hide';
      this.taskSearchTab = false;
      this.ShowAllSearchTab = false;
      this.isDisplayed = true;
    } else {
      this.buttonName = 'Show';
    }
  }

  removeGroupUser() {
    this.removeUserFromGroup = !this.removeUserFromGroup;
    if (this.taskSearchTab) {
      this.buttonName = 'Hide';
    } else {
      this.buttonName = 'Show';
    }
  }

  getMyTasks() {
    this.isDisplayed = true;
    let getGroupId = localStorage.getItem('groupId');
    let taskFilterBody = {
      groupId: getGroupId,
      taskAssignTo: 'mytasks',
      taskDueDate: '',
      taskStatus: '',
    };
    this.isMarkMyTask = true;
    this.groupTaskList = [];
    this.todoTaskService.getFilterTaskList(taskFilterBody).subscribe(
      (res) => {
        if (res.status === false) {
        } else {
          this.isDisplayed = this.isDisplayed;
          this.groupTaskList = res.taskList;
          this.OpenTaskList = [];
          let arrOpenTask = new Array();
          for (let i = 0; i < res.taskList.length; i++) {
            if (
              res.taskList[i].taskStatus == 'Open' &&
              res.taskList[i].isClosed == false
            ) {
              arrOpenTask.push({
                groupId: res.taskList[i].groupId,
                taskId: res.taskList[i].taskId,
                taskDisplayOrder: res.taskList[i].taskDisplayOrder,
                taskDescription: res.taskList[i].taskDescription,
                taskAssignTo: res.taskList[i].taskAssignTo,
                taskDueDate: res.taskList[i].taskDueDate,
                isTaskOverDue: res.taskList[i].isTaskOverDue,
                taskStatus: res.taskList[i].taskStatus,
                isClosed: res.taskList[i].isClosed,
                userDetails: {
                  userId: res.taskList[i].userDetails.userId,
                  userEmail: res.taskList[i].userDetails.userEmail,
                  userName: res.taskList[i].userDetails.userName,
                },
                createdUserDetails: {
                  userId: res.taskList[i].createdUserDetails.userId,
                  userEmail: res.taskList[i].createdUserDetails.userEmail,
                  userName: res.taskList[i].createdUserDetails.userName,
                },
                createdAt: res.taskList[i].createdAt,
                createdBy: res.taskList[i].createdBy,
                modifiedAt: res.taskList[i].modifiedAt,
                modifiedBy: res.taskList[i].modifiedBy,
              });
            }
          }
          this.OpenTaskList = arrOpenTask;
          this.InProgressTaskList = [];
          let arrInProgressTask = new Array();
          for (let j = 0; j < res.taskList.length; j++) {
            if (
              res.taskList[j].taskStatus == 'In Progress' &&
              res.taskList[j].isClosed == false
            ) {
              arrInProgressTask.push({
                groupId: res.taskList[j].groupId,
                taskId: res.taskList[j].taskId,
                taskDisplayOrder: res.taskList[j].taskDisplayOrder,
                taskDescription: res.taskList[j].taskDescription,
                taskAssignTo: res.taskList[j].taskAssignTo,
                taskDueDate: res.taskList[j].taskDueDate,
                isTaskOverDue: res.taskList[j].isTaskOverDue,
                taskStatus: res.taskList[j].taskStatus,
                isClosed: res.taskList[j].isClosed,
                userDetails: {
                  userId: res.taskList[j].userDetails.userId,
                  userEmail: res.taskList[j].userDetails.userEmail,
                  userName: res.taskList[j].userDetails.userName,
                },
                createdUserDetails: {
                  userId: res.taskList[j].createdUserDetails.userId,
                  userEmail: res.taskList[j].createdUserDetails.userEmail,
                  userName: res.taskList[j].createdUserDetails.userName,
                },
                createdAt: res.taskList[j].createdAt,
                createdBy: res.taskList[j].createdBy,
                modifiedAt: res.taskList[j].modifiedAt,
                modifiedBy: res.taskList[j].modifiedBy,
              });
            }
          }
          this.InProgressTaskList = arrInProgressTask;

          this.DoneTaskList = [];
          let arrDoneTask = new Array();
          for (let k = 0; k < res.taskList.length; k++) {
            if (
              res.taskList[k].taskStatus == 'Done' &&
              res.taskList[k].isClosed == false
            ) {
              arrDoneTask.push({
                groupId: res.taskList[k].groupId,
                taskId: res.taskList[k].taskId,
                taskDisplayOrder: res.taskList[k].taskDisplayOrder,
                taskDescription: res.taskList[k].taskDescription,
                taskAssignTo: res.taskList[k].taskAssignTo,
                taskDueDate: res.taskList[k].taskDueDate,
                isTaskOverDue: res.taskList[k].isTaskOverDue,
                taskStatus: res.taskList[k].taskStatus,
                isClosed: res.taskList[k].isClosed,
                userDetails: {
                  userId: res.taskList[k].userDetails.userId,
                  userEmail: res.taskList[k].userDetails.userEmail,
                  userName: res.taskList[k].userDetails.userName,
                },
                createdUserDetails: {
                  userId: res.taskList[k].createdUserDetails.userId,
                  userEmail: res.taskList[k].createdUserDetails.userEmail,
                  userName: res.taskList[k].createdUserDetails.userName,
                },
                createdAt: res.taskList[k].createdAt,
                createdBy: res.taskList[k].createdBy,
                modifiedAt: res.taskList[k].modifiedAt,
                modifiedBy: res.taskList[k].modifiedBy,
              });
            }
          }
          this.DoneTaskList = arrDoneTask;
        }
      },
      (error) => {
        this.alertService.error(error);
        this.loading = false;
        if (error === 'Token Expired') {
          this.router.navigate(['/']);
        }
        // this.toastr.error('Error', error);
      }
    );
  }

  getAlltaskList() {
    this.isDisplayed = true;
    this.ShowAllSearchTab = true;
    this.taskSearch = '';
    this.taskSearchTab = false;
    this.taskSearchFilter = false;
    let getGroupId = localStorage.getItem('groupId');
    let taskFilterBody = {
      groupId: getGroupId,
      taskAssignTo: '',
      taskDueDate: '',
      taskStatus: 'All',
    };

    this.todoTaskService.getFilterTaskList(taskFilterBody).subscribe(
      (res) => {
        if (res.status === false) {
        } else {
          this.isDisplayed = this.isDisplayed;
          this.groupTaskList = res.taskList;
          this.OpenTaskList = [];
          let arrOpenTask = new Array();
          for (let i = 0; i < res.taskList.length; i++) {
            if (
              res.taskList[i].taskStatus == 'Open' &&
              res.taskList[i].isClosed == false
            ) {
              arrOpenTask.push({
                groupId: res.taskList[i].groupId,
                taskId: res.taskList[i].taskId,
                taskDescription: res.taskList[i].taskDescription,
                taskAssignTo: res.taskList[i].taskAssignTo,
                taskDueDate: res.taskList[i].taskDueDate,
                isTaskOverDue: res.taskList[i].isTaskOverDue,
                taskStatus: res.taskList[i].taskStatus,
                isClosed: res.taskList[i].isClosed,
                userDetails: {
                  userId: res.taskList[i].userDetails.userId,
                  userEmail: res.taskList[i].userDetails.userEmail,
                  userName: res.taskList[i].userDetails.userName,
                },
                createdUserDetails: {
                  userId: res.taskList[i].createdUserDetails.userId,
                  userEmail: res.taskList[i].createdUserDetails.userEmail,
                  userName: res.taskList[i].createdUserDetails.userName,
                },
                createdAt: res.taskList[i].createdAt,
                createdBy: res.taskList[i].createdBy,
                modifiedAt: res.taskList[i].modifiedAt,
                modifiedBy: res.taskList[i].modifiedBy,
              });
            }
          }
          this.OpenTaskList = arrOpenTask;
          this.InProgressTaskList = [];
          let arrInProgressTask = new Array();
          for (let i = 0; i < res.taskList.length; i++) {
            if (
              res.taskList[i].taskStatus == 'In Progress' &&
              res.taskList[i].isClosed == false
            ) {
              arrInProgressTask.push({
                groupId: res.taskList[i].groupId,
                taskId: res.taskList[i].taskId,
                taskDescription: res.taskList[i].taskDescription,
                taskAssignTo: res.taskList[i].taskAssignTo,
                taskDueDate: res.taskList[i].taskDueDate,
                isTaskOverDue: res.taskList[i].isTaskOverDue,
                taskStatus: res.taskList[i].taskStatus,
                userDetails: {
                  userId: res.taskList[i].userDetails.userId,
                  userEmail: res.taskList[i].userDetails.userEmail,
                  userName: res.taskList[i].userDetails.userName,
                },
                createdUserDetails: {
                  userId: res.taskList[i].createdUserDetails.userId,
                  userEmail: res.taskList[i].createdUserDetails.userEmail,
                  userName: res.taskList[i].createdUserDetails.userName,
                },
                createdAt: res.taskList[i].createdAt,
                createdBy: res.taskList[i].createdBy,
                modifiedAt: res.taskList[i].modifiedAt,
                modifiedBy: res.taskList[i].modifiedBy,
              });
            }
          }
          this.InProgressTaskList = arrInProgressTask;

          this.DoneTaskList = [];
          let arrDoneTask = new Array();
          for (let i = 0; i < res.taskList.length; i++) {
            if (
              res.taskList[i].taskStatus == 'Done' &&
              res.taskList[i].isClosed == false
            ) {
              arrDoneTask.push({
                groupId: res.taskList[i].groupId,
                taskId: res.taskList[i].taskId,
                taskDescription: res.taskList[i].taskDescription,
                taskAssignTo: res.taskList[i].taskAssignTo,
                taskDueDate: res.taskList[i].taskDueDate,
                isTaskOverDue: res.taskList[i].isTaskOverDue,
                taskStatus: res.taskList[i].taskStatus,
                userDetails: {
                  userId: res.taskList[i].userDetails.userId,
                  userEmail: res.taskList[i].userDetails.userEmail,
                  userName: res.taskList[i].userDetails.userName,
                },
                createdUserDetails: {
                  userId: res.taskList[i].createdUserDetails.userId,
                  userEmail: res.taskList[i].createdUserDetails.userEmail,
                  userName: res.taskList[i].createdUserDetails.userName,
                },
                createdAt: res.taskList[i].createdAt,
                createdBy: res.taskList[i].createdBy,
                modifiedAt: res.taskList[i].modifiedAt,
                modifiedBy: res.taskList[i].modifiedBy,
              });
            }
          }
          this.DoneTaskList = arrDoneTask;
        }
      },
      (error) => {
        this.alertService.error(error);
        this.loading = false;
        if (error === 'Token Expired') {
          this.router.navigate(['/']);
        }
        // this.toastr.error('Error', error);
      }
    );
  }

  get f() {
    return this.AddGroupForm.controls;
  }
  onSubmitAddGroup(AddGroupForm) {
    this.groupSubmitted = true;
    if (this.AddGroupForm.invalid) {
      return;
    }
    this.loadingBtn = true;
    if (this.AddGroupForm.controls.groupName.value == '') {
      false;
    }
    if (
      this.AddGroupForm.controls.userEmail.value === 'All' ||
      this.AddGroupForm.controls.userEmail.value == undefined
    ) {
      let createData = {
        groupName: this.AddGroupForm.controls.groupName.value.trim(),
        usersEmail: '',
      };
      this.todoTaskService.addGroup(createData).subscribe(
        (res) => {
          if (res.status === false) {
          } else {
            if (res.status === 'success') {
              this.toastr.success('Success', res.message);
              this.getGroupList();
              this.AddGroupForm.reset();
              this.groupSubmitted = false;
              this.loadingBtn = false;
              this.AddGroup = false;
              this.getMembersList();
            }
          }
        },
        (error) => {
          this.error = error;
          this.loading = false;
          this.toastr.error('Error', this.error);
          this.loadingBtn = false;
          if (error === 'Token Expired') {
            this.router.navigate(['/']);
          }
        }
      );
    } else {
      if (this.AddGroupForm.controls.userEmail.value === null) {
        let createData = {
          groupName: this.AddGroupForm.controls.groupName.value,
        };
        this.todoTaskService.addGroup(createData).subscribe(
          (res) => {
            if (res.status === false) {
            } else {
              if (res.status === 'success') {
                this.toastr.success('Success', res.message);
                this.getGroupList();
                this.AddGroupForm.reset();
                this.groupSubmitted = false;
                this.loadingBtn = false;
                this.AddGroup = false;
                this.getMembersList();
              }
            }
          },
          (error) => {
            this.error = error;
            this.loading = false;
            this.toastr.error('Error', this.error);
            this.loadingBtn = false;
            if (error === 'Token Expired') {
              this.router.navigate(['/']);
            }
          }
        );
      } else if (this.AddGroupForm.controls.userEmail.value.length != 0) {
        let arrEmail = [];
        for (
          let j = 0;
          j < this.AddGroupForm.controls.userEmail.value.length;
          j++
        ) {
          let userEmailCommaList =
            this.AddGroupForm.controls.userEmail.value.join(',');
          const emailPattern =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (
            !emailPattern.test(
              this.AddGroupForm.controls.userEmail.value[j].trim()
            )
          ) {
            this.loadingBtn = false;
            return this.toastr.error('Error', 'Please enter valid email');
          } else {
            let usersEmailList =
              this.AddGroupForm.controls.userEmail.value.join(',');
            arrEmail = usersEmailList.split(',');
          }
        }
        let createData = {
          groupName: this.AddGroupForm.controls.groupName.value,
          usersEmail: arrEmail,
        };
        this.todoTaskService.addGroup(createData).subscribe(
          (res) => {
            if (res.status === false) {
            } else {
              if (res.status === 'success') {
                this.toastr.success('Success', res.message);
                this.getGroupList();
                this.AddGroupForm.reset();
                this.groupSubmitted = false;
                this.loadingBtn = false;
                this.AddGroup = false;
                this.getMembersList();
              }
            }
          },
          (error) => {
            this.error = error;
            this.loading = false;
            this.toastr.error('Error', this.error);
            this.loadingBtn = false;
            if (error === 'Token Expired') {
              this.router.navigate(['/']);
            }
          }
        );
      } else {
        let createData = {
          groupName: this.AddGroupForm.controls.groupName.value,
        };
        this.todoTaskService.addGroup(createData).subscribe(
          (res) => {
            if (res.status === false) {
            } else {
              if (res.status === 'success') {
                this.toastr.success('Success', res.message);
                this.getGroupList();
                this.AddGroupForm.reset();
                this.groupSubmitted = false;
                this.loadingBtn = false;
                this.AddGroup = false;
                this.getMembersList();
              }
            }
          },
          (error) => {
            this.error = error;
            this.loading = false;
            this.toastr.error('Error', this.error);
            this.loadingBtn = false;
            if (error === 'Token Expired') {
              this.router.navigate(['/']);
            }
          }
        );
      }
    }
  }

  makeFavoriteTop(data) {
    let foundIndex = data.findIndex(this.hasFavorite);
    if (foundIndex === -1 || foundIndex === 0) {
      return;
    } else {
      let temp = this.GroupData[0];
      this.GroupData[0] = this.GroupData[foundIndex];
      this.GroupData[foundIndex] = temp;
    }
  }

  hasFavorite(element) {
    return element.isFavoriteGroup === true;
  }

  getGroupList() {
    this.todoTaskService.getGroupList().subscribe(
      (res) => {
        this.GroupData = res.groups;
        this.oldGroupList = this.GroupData;
        this.makeFavoriteTop(this.GroupData);
        var getGroupCount = window.sessionStorage.getItem('loadCount');
        if (getGroupCount == 'groupCount') {
          return;
        } else {
          for (let i = 0; i < this.GroupData.length; i++) {
            if (this.GroupData[i].isFavoriteGroup == true) {
              this.groupId = this.GroupData[i].groupId;
              localStorage.setItem('groupId', this.GroupData[i].groupId);
              localStorage.setItem('groupName', this.GroupData[i].groupName);
              localStorage.setItem(
                'isGroupAdmin',
                this.GroupData[i].isGroupAdmin
              );
              window.sessionStorage.setItem('loadCount', 'groupCount');
            } else {
              this.GroupData = res.groups;
              this.oldGroupList = this.GroupData;
            }
          }
        }
        let currentGroupId = localStorage.getItem('groupId');
        let groupName = localStorage.getItem('groupName');
        this.isGroupAdmin = localStorage.getItem('isGroupAdmin');
        if (currentGroupId != null || this.currentGroupId != undefined) {
          this.activateClass(currentGroupId);
          $('#groupNameId').html(groupName);
        }
        if (groupName || this.currentGroupId != undefined) {
          this.getGroupdeatils(
            groupName,
            currentGroupId,
            JSON.parse(this.isGroupAdmin)
          );
          $('#groupNameId').html(groupName);
        } else {
          return;
        }
        if (JSON.parse(this.isGroupAdmin) === true) {
          this.systemSettingIcon = true;
        } else if (JSON.parse(this.isGroupAdmin) === false) {
          this.systemSettingIcon = false;
        }
      },
      (error) => {
        this.alertService.error(error);
        // this.toastr.error('Error', error);
        if (error === 'Token Expired') {
          this.router.navigate(['/']);
        }
      }
    );
  }

  getMembersList() {
    this.todoTaskService.getMembersList().subscribe(
      (res) => {
        this.allMembersData = res.allMembers;
      },
      (error) => {
        this.alertService.error(error);
        // this.toastr.error('Error', error);
        if (error === 'Token Expired') {
          this.router.navigate(['/']);
        }
      }
    );
  }
  getNewMembersList(groupId) {
    if (groupId == null || groupId == undefined || groupId == '') {
      return;
    } else {
      this.todoTaskService.getNewMembersList(groupId).subscribe(
        (res) => {
          this.newMembers = res.newMembers;
        },
        (error) => {
          this.alertService.error(error);
          // this.toastr.error('Error', error);
          if (error === 'Token Expired') {
            this.router.navigate(['/']);
          }
        }
      );
    }
  }

  getGroupMembers(groupId) {
    if (groupId == null || groupId == undefined || groupId == '') {
      return;
    } else {
      this.todoTaskService.getGroupMembers(groupId).subscribe(
        (res) => {
          this.groupMemberData = res.groupMembers;
          this.oldData = this.groupMemberData;
          var textUser = new Array();
          for (let i = 0; i < this.groupMemberData.length; i++) {
            textUser.push({
              tag: this.groupMemberData[i].userEmail,
              display: this.groupMemberData[i].userEmail,
            });
          }
          this.items = textUser;
        },
        (error) => {
          this.alertService.error(error);
          // this.toastr.error('Error', error);
          if (error === 'Token Expired') {
            this.router.navigate(['/']);
          }
        }
      );
    }
  }

  getGroupOwnerList(groupId) {
    this.isMaker = false;
    if (groupId == null || groupId == undefined || groupId == '') {
      return;
    } else {
      this.todoTaskService.getGroupOwnerList(groupId).subscribe(
        (res) => {
          this.ownerUserList = res.groupMembers;
          this.isMaker = res.isMaker;
          for (let i = 0; i < this.ownerUserList.length; i++) {
            if (
              this.ownerUserList[i].isGroupAdmin === true &&
              this.ownerUserList[i].isGroupOwner === true
            ) {
              this.ownerUserList.splice(i, 1);
              i--;
            }
          }

          if (this.ownerUserList.length == 0) {
            this.isOwner = true;
          } else {
            this.isOwner = false;
          }
        },
        (error) => {
          this.alertService.error(error);
          // this.toastr.error('Error', error);
          if (error === 'Token Expired') {
            this.router.navigate(['/']);
          }
        }
      );
    }
  }

  uncheckAll() {
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
  }

  makeUserToAdmin() {
    if (this.userSelectedForAdmin.length === 0) {
      this.matMenuTrigger.closeMenu();
      return;
    }
    const userToAdminData = {
      userToAdminsData: this.userSelectedForAdmin,
    };

    this.todoTaskService.makeUserToAdmin(userToAdminData).subscribe(
      (res) => {
        this.uncheckAll();
        this.userSelectedForAdmin = [];
        this.toastr.success('Success', res.message);
        this.matMenuTrigger.closeMenu();
      },
      (error) => {
        this.alertService.error(error);
        this.toastr.error('Error', error);
        if (error === 'Token Expired') {
          this.router.navigate(['/']);
        }
      }
    );
  }

  adminUserCollection(userId: any, userMemberId: any, groudId: any) {
    let abc: any = {};
    abc.userId = userId;
    abc.userMemberId = userMemberId;
    abc.groupId = groudId;

    if (this.userSelectedForAdmin.length === 0) {
      this.userSelectedForAdmin.push(abc);
      abc = {};
    } else {
      let storedIds = this.userSelectedForAdmin.map((x) => {
        return x.userId;
      });
      let checkT = storedIds.includes(abc.userId);
      if (checkT) {
        let foundIndex = storedIds.findIndex((el) => el == abc.userId);
        this.userSelectedForAdmin.splice(foundIndex, 1);
        abc = {};
      } else {
        this.userSelectedForAdmin.push(abc);

        abc = {};
      }
    }
  }

  deleteGroup(groupId): void {
    let message: string = 'Are you sure, you want to remove this group';
    let deleteGroupName = localStorage.getItem('groupName');
    if (this.dialog.openDialogs.length == 0) {
      const ref = this.dialog.open(ConfirmDialogComponent, {
        width: '340px',
        height: 'auto',
        backdropClass: 'custom-dialog-backdrop-class',
        panelClass: 'custom-dialog-panel-class',
        data: {
          groupId: groupId,
          DeleteMsg: message,
          groupName: deleteGroupName,
        },
      });

      ref.afterClosed().subscribe((result) => {
        if (result.event == 'close') {
          // $('#groupNameLabel').html(result.groupName);
          // $('#groupNameLabel2').html(result.groupName);
          // $('#groupNameId').html(result.groupName)
        } else {
          // $('#groupNameLabel').html('');
          // $('#groupNameLabel2').html(result.groupName);
          // $('#groupNameId').html('')
          this.getGroupList();
          let isGroupAdmin = localStorage.getItem('isGroupAdmin');
          const newArray = this.GroupData.map((elem, index, array) => {
            if (groupId == elem.groupId) {
              this.isDisplayed = false;
              localStorage.setItem('groupId', '');
              localStorage.setItem('groupName', '');
              return;
            } else {
              if (this.isDisplayed === true) {
                return;
              }
              this.getGroupdeatils(
                elem.groupName,
                elem.groupId,
                elem.isGroupAdmin
              );
            }
          });
          this.getGroupList();
          localStorage.removeItem('taskId');
        }
      });
    }
  }

  public currentGroup;
  getGroupdeatils(groupName, groupId, isGroupAdmin) {
    this.isTask = false;
    this.submitted = false;
    this.ShowAllSearchTab = false;
    this.getGroupOwnerList(groupId);
    this.getGroupById(groupId);
    this.taskSection = true;
    if (JSON.parse(isGroupAdmin) == true) {
      this.systemSettingIcon = true;
    } else {
      this.systemSettingIcon = false;
    }

    if (groupId) {
      this.currentGroup = groupId;
    } else {
      this.currentGroup = this.currentGroupId;
    }
    localStorage.setItem('groupId', groupId);
    localStorage.setItem('groupName', groupName);
    localStorage.setItem('isGroupAdmin', isGroupAdmin);
    this.isDisplayed = true;
    this.globalSelectedGroup = groupName;
    this.isDisplayed = true;
    this.isGroupAdmin = isGroupAdmin;
    this.todoTaskService.getGroupTaskList(groupId).subscribe(
      (res) => {
        if (res.status === false) {
        } else {
          this.getGroupMembers(groupId);
          this.getNewMembersList(groupId);
          this.isDisplayed = this.isDisplayed;
          this.groupTaskList = res.taskList;
          this.isTask = this.groupTaskList.length !== 0 ? true : false;
          this.OpenTaskList = [];
          let arrOpenTask = new Array();
          for (let i = 0; i < res.taskList.length; i++) {
            if (
              res.taskList[i].taskStatus == 'Open' &&
              res.taskList[i].isClosed == false
            ) {
              arrOpenTask.push({
                groupId: res.taskList[i].groupId,
                taskId: res.taskList[i].taskId,
                taskDisplayOrder: res.taskList[i].taskDisplayOrder,
                taskDescription: res.taskList[i].taskDescription,
                taskAssignTo: res.taskList[i].taskAssignTo,
                taskDueDate: res.taskList[i].taskDueDate,
                isTaskOverDue: res.taskList[i].isTaskOverDue,
                taskStatus: res.taskList[i].taskStatus,
                isClosed: res.taskList[i].isClosed,
                userDetails: {
                  userId: res.taskList[i].userDetails.userId,
                  userEmail: res.taskList[i].userDetails.userEmail,
                  userName: res.taskList[i].userDetails.userName,
                },
                createdUserDetails: {
                  userId: res.taskList[i].createdUserDetails.userId,
                  userEmail: res.taskList[i].createdUserDetails.userEmail,
                  userName: res.taskList[i].createdUserDetails.userName,
                },
                createdAt: res.taskList[i].createdAt,
                createdBy: res.taskList[i].createdBy,
                modifiedAt: res.taskList[i].modifiedAt,
                modifiedBy: res.taskList[i].modifiedBy,
              });
            }
          }
          this.OpenTaskList = arrOpenTask;
          this.InProgressTaskList = [];
          let arrInProgressTask = new Array();
          for (let i = 0; i < res.taskList.length; i++) {
            if (
              res.taskList[i].taskStatus == 'In Progress' &&
              res.taskList[i].isClosed == false
            ) {
              arrInProgressTask.push({
                groupId: res.taskList[i].groupId,
                taskId: res.taskList[i].taskId,
                taskDisplayOrder: res.taskList[i].taskDisplayOrder,
                taskDescription: res.taskList[i].taskDescription,
                taskAssignTo: res.taskList[i].taskAssignTo,
                taskDueDate: res.taskList[i].taskDueDate,
                isTaskOverDue: res.taskList[i].isTaskOverDue,
                taskStatus: res.taskList[i].taskStatus,
                isClosed: res.taskList[i].isClosed,
                userDetails: {
                  userId: res.taskList[i].userDetails.userId,
                  userEmail: res.taskList[i].userDetails.userEmail,
                  userName: res.taskList[i].userDetails.userName,
                },
                createdUserDetails: {
                  userId: res.taskList[i].createdUserDetails.userId,
                  userEmail: res.taskList[i].createdUserDetails.userEmail,
                  userName: res.taskList[i].createdUserDetails.userName,
                },
                createdAt: res.taskList[i].createdAt,
                createdBy: res.taskList[i].createdBy,
                modifiedAt: res.taskList[i].modifiedAt,
                modifiedBy: res.taskList[i].modifiedBy,
              });
            }
          }
          this.InProgressTaskList = arrInProgressTask;

          this.DoneTaskList = [];
          let arrDoneTask = new Array();
          for (let i = 0; i < res.taskList.length; i++) {
            if (
              res.taskList[i].taskStatus == 'Done' &&
              res.taskList[i].isClosed == false
            ) {
              arrDoneTask.push({
                groupId: res.taskList[i].groupId,
                taskId: res.taskList[i].taskId,
                taskDisplayOrder: res.taskList[i].taskDisplayOrder,
                taskDescription: res.taskList[i].taskDescription,
                taskAssignTo: res.taskList[i].taskAssignTo,
                taskDueDate: res.taskList[i].taskDueDate,
                isTaskOverDue: res.taskList[i].isTaskOverDue,
                taskStatus: res.taskList[i].taskStatus,
                isClosed: res.taskList[i].isClosed,
                userDetails: {
                  userId: res.taskList[i].userDetails.userId,
                  userEmail: res.taskList[i].userDetails.userEmail,
                  userName: res.taskList[i].userDetails.userName,
                },
                createdUserDetails: {
                  userId: res.taskList[i].createdUserDetails.userId,
                  userEmail: res.taskList[i].createdUserDetails.userEmail,
                  userName: res.taskList[i].createdUserDetails.userName,
                },
                createdAt: res.taskList[i].createdAt,
                createdBy: res.taskList[i].createdBy,
                modifiedAt: res.taskList[i].modifiedAt,
                modifiedBy: res.taskList[i].modifiedBy,
              });
            }
          }
          this.DoneTaskList = arrDoneTask;
          if (this.isDisplayed == true) {
            if (this.groupTaskList.length == 0) {
            } else {
              localStorage.setItem('groupId', groupId);
              localStorage.setItem('groupName', groupName);
              let getGroupId = localStorage.getItem('groupId');
            }
          }
        }
      },
      (error) => {
        this.alertService.error(error);
        this.loading = false;
        if (error === 'Token Expired') {
          this.router.navigate(['/']);
        }
      }
    );
  }

  ngAfterViewInit() {
    // this.picker.nativeElement.open()
  }

  deleteTask(TaskId, IsMArkMyTask) {
    let getGroupId = localStorage.getItem('groupId');
    let message: string = 'Are you sure, you want to remove this task ?';
    const confirmDialog = this.dialog.open(ConfirmDialog2Component, {
      width: '340px',
      height: 'auto',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: 'custom-dialog-panel-class',
      data: { TaskId: TaskId, DeleteMsg: message },
    });
    confirmDialog.afterClosed().subscribe((result) => {
      if (result.event == 'close') {
        return;
      } else {
        localStorage.removeItem('taskId');
        let isGroupAdmin = localStorage.getItem('isGroupAdmin');
        let groupName = localStorage.getItem('groupName');
        if (IsMArkMyTask === true) {
          this.getMyTasks();
          if (this.groupTaskList.length === 0) {
            this.getGroupdeatils(
              result.groupName ? result.groupName : groupName,
              getGroupId,
              isGroupAdmin
            );
            this.getGroupdeatilsReloaded(getGroupId);
          }
        } else {
          this.getGroupdeatils(
            result.groupName ? result.groupName : groupName,
            getGroupId,
            isGroupAdmin
          );
          this.getGroupdeatilsReloaded(getGroupId);
        }
      }
    });
  }
  getGroupdeatilsReloaded(groupId) {
    if (groupId) {
      this.groupTaskList;
    }
  }
  // public currentGroup;
  public activateClass(index: any) {
    if (index) {
      this.currentGroup = index;
    } else {
      this.currentGroup = this.currentGroupId;
    }
  }

  changeStatus(taskId) {
    if (taskId != null || taskId != undefined) {
      this.todoTaskService.getTask(taskId).subscribe(
        (res) => {
          this.taskData = res;

          let taskDueDate1 = this.datepipe.transform(
            this.taskData.taskDueDate,
            'MM/dd/yyyy'
          );
          let EditData = {
            taskDescription: this.taskData.taskDescription,
            taskAssignTo: this.taskData.taskAssignTo,
            taskDueDate: taskDueDate1,
          };
          this.EditTaskForm.setValue(EditData);
        },
        (error) => {
          this.alertService.error(error);
          this.toastr.error('Error', error);
          if (error === 'Token Expired') {
            this.router.navigate(['/']);
          }
        }
      );
    }
  }

  getGroupName(g) {
    this.editForm = true;
    this.AddGroup = false;
    localStorage.setItem('updateGroupId', g.groupId);
    this.editGroupName = g.groupName;
  }

  updateGroupName(saveGroupName) {
    saveGroupName = saveGroupName.trim();
    if (saveGroupName === '') {
      this.errorMsg = 'Please enter group name';
      return false;
    } else {
      this.errorMsg = '';
    }
    localStorage.setItem('groupName', saveGroupName);
    $('#groupNameId').html(saveGroupName);
    let getGroupId = localStorage.getItem('updateGroupId');
    let data = {
      groupName: saveGroupName,
    };
    if (getGroupId != null || getGroupId != undefined) {
      this.todoTaskService.updateGroup(getGroupId, data).subscribe(
        (res) => {
          if (res.status === false) {
            this.toastr.error('error', res.message);
          } else {
            if (res.status === 'success') {
              this.toastr.success('Success', res.message);
              this.getGroupList();
              this.editForm = false;
            }
          }
        },
        (error) => {
          this.alertService.error(error);
          this.toastr.error('Error', error);
          if (error === 'Token Expired') {
            this.router.navigate(['/']);
          }
        }
      );
    }
  }

  onReminder() {
    let getGroupId = localStorage.getItem('groupId');
    const message = `Are you sure, you want to send pending task reminder to group members?`;
    const dialogData = new ConfirmDialogModel('Confirm Action', message);
    const dialogRef = this.dialog.open(ConfirmComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      this.result = dialogResult;
      if (this.result == true) {
        if (getGroupId != null || getGroupId != undefined) {
          this.todoTaskService.groupTaskReminder(getGroupId).subscribe(
            (res) => {
              if (res.status === false) {
                this.toastr.error('error', res.message);
              } else {
                if (res.status === 'success') {
                  this.toastr.success('Success', res.message);
                }
              }
            },
            (error) => {
              this.alertService.error(error);
              this.toastr.error('Error', error);
              if (error === 'Token Expired') {
                this.router.navigate(['/']);
              }
            }
          );
        }
      }
    });
  }

  leaveGroup(groupId): void {
    const message = `Are you sure you want to leave this group?`;
    const dialogData = new ConfirmDialogModel('Confirm Action', message);
    const dialogRef = this.dialog.open(ConfirmComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      this.result = dialogResult;
      if (this.result == true) {
        let body = {
          groupMemberId: '',
        };
        if (groupId != null || groupId != undefined) {
          this.todoTaskService.leaveGroup(groupId, body).subscribe(
            (res) => {
              if (res.status === false) {
                this.toastr.error('error', res.message);
              } else {
                if (res.status === 'success') {
                  this.toastr.success('Success', res.message);

                  // Code added by kedar
                  // start
                  this.isDisplayed = false;
                  localStorage.setItem('groupId', '');
                  localStorage.setItem('groupName', '');
                  // end

                  this.getGroupList();
                  let groupName = localStorage.getItem('groupName');
                  if (
                    groupName != null ||
                    groupName != '' ||
                    groupName != undefined
                  ) {
                    localStorage.removeItem('groupName');
                    $('#groupNameId').html('');
                  }
                }
              }
            },
            (error) => {
              this.alertService.error(error);
              this.toastr.error('Error', error);
              if (error === 'Token Expired') {
                this.router.navigate(['/']);
              }
            }
          );
        }
      }
    });
  }

  leaveGroupOwner(groupId, groupMemberId): void {
    const message = `Are you sure you want to make admin to this user?`;
    const dialogData = new ConfirmDialogModel('Confirm Action', message);
    const dialogRef = this.dialog.open(ConfirmComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      this.result = dialogResult;
      if (this.result == true) {
        let body = {
          groupMemberId: groupMemberId,
        };
        if (groupId != null || groupId != undefined) {
          this.todoTaskService.leaveGroup(groupId, body).subscribe(
            (res) => {
              if (res.status === false) {
                this.toastr.error('error', res.message);
              } else {
                if (res.status === 'success') {
                  this.toastr.success('Success', res.message);
                  this.getGroupList();
                  let groupName = localStorage.getItem('groupName');
                  if (
                    groupName != null ||
                    groupName != '' ||
                    groupName != undefined
                  ) {
                    localStorage.removeItem('groupName');
                    $('#groupNameId').html('');
                  }
                }
              }
            },
            (error) => {
              this.alertService.error(error);
              this.toastr.error('Error', error);
              if (error === 'Token Expired') {
                this.router.navigate(['/']);
              }
            }
          );
        }
      }
    });
  }

  addFavGroup(groupId) {
    let body = {
      groupId: groupId,
    };
    if (groupId != null || groupId != undefined) {
      this.todoTaskService.addFavGroup(body).subscribe(
        (res) => {
          if (res.status === false) {
            this.toastr.error('error', res.message);
          } else {
            if (res.status === 'success') {
              this.toastr.success('Success', res.message);
              this.getGroupList();
            }
          }
        },
        (error) => {
          this.alertService.error(error);
          this.toastr.error('Error', error);
          if (error === 'Token Expired') {
            this.router.navigate(['/']);
          }
        }
      );
    }
  }

  fireDeleteEventUser(groupMemberId) {
    let data = {
      groupMemberId,
    };
    let getGroupId = localStorage.getItem('groupId');
    this.todoTaskService.deleteGroupMenber(getGroupId, data).subscribe(
      (res) => {
        if (res.status == 'failed' || res.status == false) {
          this.toastr.warning('Warning', res.status.message);
          this.toastr.error('Error', res.message);
        } else {
          if (res.status === 'success') {
            this.toastr.success('Success', res.message);
            this.getGroupMembers(getGroupId);
            this.getNewMembersList(getGroupId);
            let isGroupAdmin = localStorage.getItem('isGroupAdmin');
            let groupName = localStorage.getItem('groupName');
            this.getGroupdeatils(groupName, getGroupId, isGroupAdmin);
          }
        }
      },
      (error) => {
        this.alertService.error(error);
        this.loading = false;
        this.error = error;
        if (error === 'Token Expired') {
          this.router.navigate(['/']);
        }
      }
    );
  }

  getGroupFromDropDown(event) {
    if (!event) {
      return;
    }
    let isGroupAdmin = localStorage.getItem('isGroupAdmin');
    this.getGroupdeatils(event.groupName, event.groupId, isGroupAdmin);
    this.globalSelectedGroup = event.groupName;
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
            let getGroupId = localStorage.getItem('groupId');
            let groupName = localStorage.getItem('groupName');
            let isGroupAdmin = localStorage.getItem('isGroupAdmin');
            this.getGroupdeatils(groupName, getGroupId, isGroupAdmin);
          }
        }
      },
      (error) => {
        this.alertService.error(error);
        this.loading = false;
        if (error === 'Token Expired') {
          this.router.navigate(['/']);
        }
      }
    );
  }

  get u() {
    return this.addGroupNewMembersForm.controls;
  }
  addGroupMembers(addGroupNewMembersForm) {
    let groupId = localStorage.getItem('groupId');
    this.loadingBtn = true;
    if (groupId === null || groupId === undefined) {
      this.loadingBtn = false;
      return this.toastr.error('Error', 'Please select group');
    } else {
      if (
        this.addGroupNewMembersForm.controls.userEmail.value.length === 0 ||
        this.addGroupNewMembersForm.controls.userEmail.value === null ||
        this.addGroupNewMembersForm.controls.userEmail.value === ''
      ) {
        this.loadingBtn = false;
        return this.toastr.error(
          'Error',
          'Please select users or add email address'
        );
      } else if (
        this.addGroupNewMembersForm.controls.userEmail.value.length != 0
      ) {
        let arrEmail = [];
        for (
          let j = 0;
          j < this.addGroupNewMembersForm.controls.userEmail.value.length;
          j++
        ) {
          let userEmailCommaList =
            this.addGroupNewMembersForm.controls.userEmail.value.join(',');
          const emailPattern =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (
            !emailPattern.test(
              this.addGroupNewMembersForm.controls.userEmail.value[j].trim()
            )
          ) {
            this.loadingBtn = false;
            return this.toastr.error('Error', 'Please enter valid email');
          } else {
            let usersEmailList =
              this.addGroupNewMembersForm.controls.userEmail.value.join(',');
            arrEmail = usersEmailList.split(',');
          }
        }
        let addNewGroupMembersData = {
          usersEmail: arrEmail,
        };
        this.todoTaskService
          .addGroupMember(groupId, addNewGroupMembersData)
          .subscribe(
            (res) => {
              if (res.status === false) {
              } else {
                if (res.status === 'success') {
                  this.toastr.success('Success', res.message);
                  this.onClearAllInvite();
                  let getGroupId = localStorage.getItem('groupId');
                  let groupName = localStorage.getItem('groupName');
                  let isGroupAdmin = localStorage.getItem('isGroupAdmin');
                  if (
                    getGroupId != null ||
                    groupName != null ||
                    isGroupAdmin != null
                  ) {
                    this.getGroupdeatils(groupName, getGroupId, isGroupAdmin);
                    this.getGroupMembers(getGroupId);
                  }
                  this.loadingBtn = false;
                }
              }
            },
            (error) => {
              this.alertService.error(error);
              this.toastr.error('Error', error);
              this.loadingBtn = false;
              if (error === 'Token Expired') {
                this.router.navigate(['/']);
              }
            }
          );
      } else {
        this.loadingBtn = false;
      }
    }
  }
  onSelectAllInvite() {
    const selected = this.newMembers.map((item) => item.userEmail);
    if (selected.length == 0) {
      this.ngSelectView.close();

      return false;
    } else {
      this.addGroupNewMembersForm.get('userEmail').patchValue(selected);
      this.ngSelectView.close();
      return false;
    }
  }

  onClearAllInvite() {
    this.addGroupNewMembersForm.get('userEmail').patchValue([]);
    return false;
  }

  addGroupCancel() {
    this.addGroupNewMembersForm.reset();
  }

  getCheckBoxVAlue(position, ArrFilter) {
    if (position == 0) {
      this.selectedFilterOptionOpen = 'Open';
      this.tagFilterOptions1 = true;
      this.tagFilterOptionsSortBy = true;
    } else if (position == 1) {
      this.selectedFilterOptionInprogress = 'In progress';
      this.tagFilterOptions2 = true;
      this.tagFilterOptionsSortBy = true;
    } else {
      this.selectedFilterOptionDone = 'Done';
      this.tagFilterOptions3 = true;
      this.tagFilterOptionsSortBy = true;
    }
    if (this.position_stack.length === 0) {
      this.position_stack.push(position);
      let changeFilterValue = ArrFilter[position];
      changeFilterValue.checked = true;
      ArrFilter[position] = changeFilterValue;
    } else {
      if (this.position_stack.includes(position)) {
        this.position_stack.splice(position, 1);
        let changeFilterValue = ArrFilter[position];
        changeFilterValue.checked = false;
        ArrFilter[position] = changeFilterValue;
      } else {
        this.position_stack.push(position);
        let changeFilterValue = ArrFilter[position];
        changeFilterValue.checked = true;
        ArrFilter[position] = changeFilterValue;
      }
    }
    // ArrFilter.forEach((value, index) => {
    //   console.log(`index ${index}, value ${JSON.stringify(value)}`);
    //   if (position != index)
    //     value.checked = false;
    // });
    this.showMoreTaskList = 10;
    this.showMoreTask();
  }
  // getCheckBoxVAlue(position, ArrFilter) {
  //   console.log(ArrFilter)
  //   if(position == 0){
  //     this.selectedFilterOptionOpen = 'Open';
  //     this.tagFilterOptions = true
  //   }else if(position == 1){
  //     this.selectedFilterOptionInprogress = 'In progress';
  //     this.tagFilterOptions = true
  //   }else{
  //     this.selectedFilterOptionDone = 'Done';
  //     this.tagFilterOptions = true
  //   }
  //   ArrFilter.forEach((value, index) => {
  //     if (position != index)
  //       value.checked = false;
  //   });
  //   this.showMoreTaskList = 10;
  //   this.showMoreTask()
  // }

  getAllTaskListsArr1() {
    this.unCheckAll();
    this.selectedFilterOptionOpen = '';
    this.tagFilterOptions1 = false;
    this.tagFilterOptionsSortBy = false;
  }
  getAllTaskListsArr2() {
    // this.unCheckAll2()
    this.selectedFilterOptionInprogress = '';
    this.tagFilterOptions2 = false;
    this.tagFilterOptionsSortBy = false;
  }
  getAllTaskListsArr3() {
    // this.unCheckAll3()
    this.selectedFilterOptionDone = '';
    this.tagFilterOptions3 = false;
    this.tagFilterOptionsSortBy = false;
  }

  checked() {
    return this.dataListpipeFilteer.filter((item) => {
      return item.checked;
    });
  }

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

  // getColorsTaskStatus(taskStatus) {
  //   switch (taskStatus) {
  //     case 'Open':
  //       return 'green';
  //     case 'done':
  //       return 'Red';
  //     case 'In progress':
  //       return 'blue';
  //   }
  // }
  // openUserDripDown() {
  //   // this.UserDropDown = !this.UserDropDown;
  // }
  // myFunction() {
  //   // this.UserDropDown = !this.UserDropDown;
  // }

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

  openDialogUserInvite(): void {
    let getGroupId = localStorage.getItem('groupId');
    const dialogRef = this.dialog.open(AdduserComponent, {
      width: '560px',
      height: 'auto',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: 'custom-dialog-panel-class',
      data: { pageValue: getGroupId },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  editGroupCancel() {
    this.editForm = false;
    this.errorMsg = '';
  }

  addGroupCancelButton() {
    this.SearchGroup = false;
    this.groupSubmitted = false;
    this.AddGroup = false;
    this.AddGroupForm.reset();
    this.onClearAll();
    this.AddGroup;
  }

  onSelectAll() {
    const selectedgroupUser = this.allMembersData.map((item) => item.userEmail);
    if (selectedgroupUser.length == 0) {
      return false;
    } else {
      this.AddGroupForm.get('userEmail').patchValue(selectedgroupUser);
      return false;
    }
  }

  onClearAll() {
    this.AddGroupForm.get('userEmail').patchValue([]);
    return false;
  }

  filterTasList(filterTaskListForm) {
    let getGroupId = localStorage.getItem('groupId');
    this.taskUpdateSubmitted = true;
    let taskDueDate = this.datepipe.transform(
      filterTaskListForm.value.taskDueDate,
      'yyyy-MM-dd'
    );
    let taskFilterBody = {
      groupId: getGroupId,
      taskAssignTo: filterTaskListForm.value.taskAssignTo,
      taskDueDate: taskDueDate,
      taskStatus: filterTaskListForm.value.taskStatus,
    };

    this.todoTaskService.getFilterTaskList(taskFilterBody).subscribe(
      (res) => {
        if (res.status === false) {
        } else {
          this.isDisplayed = this.isDisplayed;
          this.groupTaskList = res.taskList;
          this.OpenTaskList = [];
          let arrOpenTask = new Array();
          for (let i = 0; i < res.taskList.length; i++) {
            if (
              res.taskList[i].taskStatus == 'Open' &&
              res.taskList[i].isClosed == false
            ) {
              arrOpenTask.push({
                groupId: res.taskList[i].groupId,
                taskId: res.taskList[i].taskId,
                taskDisplayOrder: res.taskList[i].taskDisplayOrder,
                taskDescription: res.taskList[i].taskDescription,
                taskAssignTo: res.taskList[i].taskAssignTo,
                taskDueDate: res.taskList[i].taskDueDate,
                isTaskOverDue: res.taskList[i].isTaskOverDue,
                taskStatus: res.taskList[i].taskStatus,
                isClosed: res.taskList[i].isClosed,
                userDetails: {
                  userId: res.taskList[i].userDetails.userId,
                  userEmail: res.taskList[i].userDetails.userEmail,
                  userName: res.taskList[i].userDetails.userName,
                },
                createdUserDetails: {
                  userId: res.taskList[i].createdUserDetails.userId,
                  userEmail: res.taskList[i].createdUserDetails.userEmail,
                  userName: res.taskList[i].createdUserDetails.userName,
                },
                createdAt: res.taskList[i].createdAt,
                createdBy: res.taskList[i].createdBy,
                modifiedAt: res.taskList[i].modifiedAt,
                modifiedBy: res.taskList[i].modifiedBy,
              });
            }
          }
          this.OpenTaskList = arrOpenTask;
          this.InProgressTaskList = [];
          let arrInProgressTask = new Array();
          for (let i = 0; i < res.taskList.length; i++) {
            if (
              res.taskList[i].taskStatus == 'In Progress' &&
              res.taskList[i].isClosed == false
            ) {
              arrInProgressTask.push({
                groupId: res.taskList[i].groupId,
                taskId: res.taskList[i].taskId,
                taskDisplayOrder: res.taskList[i].taskDisplayOrder,
                taskDescription: res.taskList[i].taskDescription,
                taskAssignTo: res.taskList[i].taskAssignTo,
                taskDueDate: res.taskList[i].taskDueDate,
                isTaskOverDue: res.taskList[i].isTaskOverDue,
                taskStatus: res.taskList[i].taskStatus,
                isClosed: res.taskList[i].isClosed,
                userDetails: {
                  userId: res.taskList[i].userDetails.userId,
                  userEmail: res.taskList[i].userDetails.userEmail,
                  userName: res.taskList[i].userDetails.userName,
                },
                createdUserDetails: {
                  userId: res.taskList[i].createdUserDetails.userId,
                  userEmail: res.taskList[i].createdUserDetails.userEmail,
                  userName: res.taskList[i].createdUserDetails.userName,
                },
                createdAt: res.taskList[i].createdAt,
                createdBy: res.taskList[i].createdBy,
                modifiedAt: res.taskList[i].modifiedAt,
                modifiedBy: res.taskList[i].modifiedBy,
              });
            }
          }
          this.InProgressTaskList = arrInProgressTask;

          this.DoneTaskList = [];
          let arrDoneTask = new Array();
          for (let i = 0; i < res.taskList.length; i++) {
            if (
              res.taskList[i].taskStatus == 'Done' &&
              res.taskList[i].isClosed == false
            ) {
              arrDoneTask.push({
                groupId: res.taskList[i].groupId,
                taskId: res.taskList[i].taskId,
                taskDisplayOrder: res.taskList[i].taskDisplayOrder,
                taskDescription: res.taskList[i].taskDescription,
                taskAssignTo: res.taskList[i].taskAssignTo,
                taskDueDate: res.taskList[i].taskDueDate,
                isTaskOverDue: res.taskList[i].isTaskOverDue,
                taskStatus: res.taskList[i].taskStatus,
                isClosed: res.taskList[i].isClosed,
                userDetails: {
                  userId: res.taskList[i].userDetails.userId,
                  userEmail: res.taskList[i].userDetails.userEmail,
                  userName: res.taskList[i].userDetails.userName,
                },
                createdUserDetails: {
                  userId: res.taskList[i].createdUserDetails.userId,
                  userEmail: res.taskList[i].createdUserDetails.userEmail,
                  userName: res.taskList[i].createdUserDetails.userName,
                },
                createdAt: res.taskList[i].createdAt,
                createdBy: res.taskList[i].createdBy,
                modifiedAt: res.taskList[i].modifiedAt,
                modifiedBy: res.taskList[i].modifiedBy,
              });
            }
          }
          this.DoneTaskList = arrDoneTask;
        }
      },
      (error) => {
        this.alertService.error(error);
        this.loading = false;
        if (error === 'Token Expired') {
          this.router.navigate(['/']);
        }
        // this.toastr.error('Error', error);
      }
    );
  }

  filerClear() {
    this.filterTaskListForm.reset();
    let currentGroupId = localStorage.getItem('groupId');
    let groupName = localStorage.getItem('groupName');
    this.getGroupdeatils(groupName, currentGroupId, this.isGroupAdmin);
  }

  filterPanleClosed() {
    this.taskSearchFilter = false;
    this.filterTaskListForm.reset();
    let currentGroupId = localStorage.getItem('groupId');
    let groupName = localStorage.getItem('groupName');
    this.getGroupdeatils(groupName, currentGroupId, this.isGroupAdmin);
  }

  closedSearchPanel() {
    this.dataListpipeFilteer.forEach((value, index) => {
      value.checked = false;
    });
    this.taskSearchTab = false;
    this.ShowAllSearchTab = false;
    this.taskSearch = '';
  }
  unCheckAll() {
    this.dataListpipeFilteer.forEach((value, index) => {
      value.checked = false;
    });
  }

  cancelStatusClick(ev: MouseEvent) {
    ev.stopPropagation();
  }

  public taskUserupdateByDueDate(
    type: string,
    event: MatDatepickerInputEvent<Date>,
    rowDate
  ) {
    let formatTaskDueDate = this.datepipe.transform(event.value, 'yyyy-MM-dd');
    if (formatTaskDueDate == null || formatTaskDueDate == undefined) {
      return false;
    }
    let updateData = {
      groupId: rowDate.groupId,
      taskDescription: rowDate.taskDescription,
      taskAssignTo: rowDate.taskAssignTo,
      taskDueDate: formatTaskDueDate,
      taskStatus: rowDate.taskStatus,
    };

    this.todoTaskService.updateGroupTask(rowDate.taskId, updateData).subscribe(
      (res) => {
        if (res.status === false) {
        } else {
          if (res.status === 'success') {
            this.toastr.success('Success', res.message);
            let getGroupId = localStorage.getItem('groupId');
            let isGroupAdmin = localStorage.getItem('isGroupAdmin');
            let groupName = localStorage.getItem('groupName');
            this.getGroupdeatils(groupName, getGroupId, isGroupAdmin);
          }
        }
      },
      (error) => {
        this.toastr.error('Error', error);
        if (error === 'Token Expired') {
          this.router.navigate(['/']);
        }
      }
    );
  }

  taskUserChange(value) {
    if (value.taskAssignTo == null) {
      this.selectedUser = '';
    } else {
      this.selectedUser = value.taskAssignTo;
    }
  }

  public taskUserChangeByUser(
    value,
    taskId: string,
    taskDescription: string,
    taskStatus: string,
    taskDueDate: any
  ) {
    let getGroupId = localStorage.getItem('groupId');
    if (value == null || value == undefined) {
      return false;
    }
    let updateData = {
      groupId: getGroupId,
      taskDescription: taskDescription,
      taskAssignTo: value,
      taskDueDate: taskDueDate,
      taskStatus: taskStatus,
    };
    this.todoTaskService.updateGroupTask(taskId, updateData).subscribe(
      (res) => {
        if (res.status === false) {
        } else {
          if (res.status === 'success') {
            this.toastr.success('Success', res.message);
            let getGroupId = localStorage.getItem('groupId');
            let isGroupAdmin = localStorage.getItem('isGroupAdmin');
            let groupName = localStorage.getItem('groupName');
            this.getGroupdeatils(groupName, getGroupId, isGroupAdmin);
          }
        }
      },
      (error) => {
        this.toastr.error('Error', error);
        if (error === 'Token Expired') {
          this.router.navigate(['/']);
        }
      }
    );
  }

  // addFormClear() {
  //   this.AddTaskForm.reset();
  //   this.submitted = false;
  //   this.frequency = "";
  //   this.dueDays = "";
  //   this.showMasterTaskCheckbox = false;
  // }

  taskStatusValue(value) {
    this.selectedStatus = value.taskStatus;
  }

  showMoreTask() {
    this.showMoreTaskList += 5;
  }
  openShowMoreTask() {
    this.openShowMoreTaskList += 5;
  }
  inProgressShowMoreTask() {
    this.inProgressShowMoreTaskList += 5;
  }
  doneShowMoreTask() {
    this.doneShowMoreTaskList += 5;
  }

  get t() {
    return this.textToTextForm.controls;
  }
  addTextToTextTask(textToTextForm) {
    this.textTotextsubmitted = true;
    let groupId = localStorage.getItem('groupId');
    if (groupId === '') {
      this.errorMsg = 'Please select group';
      return false;
    } else {
      this.errorMsg = '';
    }
    if (this.textToTextForm.invalid) {
      return;
    }
    this.loadingBtn = true;
    let body = {
      taskText: this.textToTextForm.value.taskText,
      isUploaded: false,
      groupId: groupId,
    };
    this.todoTaskService.addTextToTextTask(body).subscribe(
      (res) => {
        if (res.status === false) {
        } else {
          if (res.status === 'success') {
            this.toastr.success('Success', res.message);
            this.loadingBtn = false;
            this.textToTextForm.reset();
            this.textTotextsubmitted = false;
            let isGroupAdmin = localStorage.getItem('isGroupAdmin');
            let groupName = localStorage.getItem('groupName');
            let groupId = localStorage.getItem('groupId');
            this.getGroupdeatils(groupName, groupId, isGroupAdmin);
          }
        }
      },
      (error) => {
        this.toastr.error('Error', error);
        this.loadingBtn = false;
        if (error === 'Token Expired') {
          this.router.navigate(['/']);
        }
      }
    );
  }

  textFileReadTask($event): void {
    this.readThis($event.target);
  }
  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    if (inputValue.files[0].type == 'text/plain') {
      var myReader: FileReader = new FileReader();
      let self = this;
      myReader.onload = function (x) {
        self.fileContent = myReader.result;
        self.fileContent = myReader.result;
        localStorage.setItem('fileContent', myReader.result as string);
      };

      myReader.readAsText(file);
      this.fileContent = myReader.result;
      setTimeout(() => {
        let textFileData = localStorage.getItem('fileContent');
        this.getData(textFileData);
      }, 1000);
    } else {
      this.errorMsg = 'File type should be .txt';
      this.resetFileUploader();
      localStorage.removeItem('fileContent');
      setTimeout(() => {
        this.errorMsg = '';
      }, 3000);
    }
  }

  getData(textdata) {
    let groupId = localStorage.getItem('groupId');
    if (groupId === '') {
      this.errorMsg = 'Please select group';
      return;
    } else {
      this.errorMsg = '';
    }
    if (textdata == '' || textdata == null) {
      this.errorMsg = 'File should not be empty';
      this.resetFileUploader();
      localStorage.removeItem('fileContent');
      setTimeout(() => {
        this.errorMsg = '';
      }, 3000);
      return;
    } else {
      let body = {
        taskText: this.fileContent,
        isUploaded: true,
        groupId: groupId,
      };
      this.todoTaskService.addTextToTextTask(body).subscribe(
        (res) => {
          if (res.status === false) {
          } else {
            if (res.status === 'success') {
              this.toastr.success('Success', res.message);
              let isGroupAdmin = localStorage.getItem('isGroupAdmin');
              let groupName = localStorage.getItem('groupName');
              let groupId = localStorage.getItem('groupId');
              this.getGroupdeatils(groupName, groupId, isGroupAdmin);
              this.resetFileUploader();
              localStorage.removeItem('fileContent');
            }
          }
        },
        (error) => {
          this.resetFileUploader();
          this.toastr.error('Error', error);
          this.loadingBtn = false;
          if (error === 'Token Expired') {
            this.router.navigate(['/']);
          }
          localStorage.removeItem('fileContent');
        }
      );
    }
    this.resetFileUploader();
    localStorage.removeItem('fileContent');
  }

  @ViewChild('fileUploader', { static: false }) fileUploader: ElementRef;
  resetFileUploader() {
    this.fileUploader.nativeElement.value = '';
  }

  itemMentioned(tag) {
    if (tag.display == '@e ') {
      this.textNewLine = true;
    }
    return tag.display;
  }

  eventHandler(event) {
    if (this.textNewLine == true) {
      var textarea = this.textToTextForm.value.taskText;
      this.taskText = textarea + '\r';
    }
    if (event.keyCode == 35) {
      let groupId = localStorage.getItem('groupId');
      this.getGroupMembers(groupId);
      this.mentionConfig = {
        mentions: [
          {
            items: [
              {
                tag: '@a - Assignee (# will give you all the list of assignees)',
                display: '@a ',
                position: 5,
                type: 'operator',
              },
              {
                tag: '@d - Due date (Please enter in dd/mm/yyyy format)',
                display: '@d ',
                position: 1,
                type: 'operator',
              },
              {
                tag: '@e - End of task',
                display: '@e ',
                position: 5,
                type: 'operator',
              },
            ],
            labelKey: 'tag',
            disableSort: true,
            triggerChar: '@',
            mentionSelect: this.itemMentioned,
          },
          {
            items: this.items,
            labelKey: 'tag',
            disableSort: true,
            triggerChar: '/',
            mentionSelect: this.itemMentioned,
          },
        ],
      };
    }
  }

  addTask() {
    if (this.dialog.openDialogs && this.dialog.openDialogs.length > 0) {
      return false;
    }
    const dialogRef = this.dialog.open(AddtaskDialogComponent, {
      width: '512px',
      maxHeight: '480px',
      position: {
        bottom: '3%',
        right: '0px',
      },
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: ['animate__animated', 'animate__slideInRight'],
      data: { groupList: this.GroupData },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      } else {
        let isGroupAdmin = localStorage.getItem('isGroupAdmin');
        this.getGroupdeatils(result.groupName, result.groupId, isGroupAdmin);
      }
    });
  }

  openTextCopy() {
    if (this.dialog.openDialogs && this.dialog.openDialogs.length > 0) {
      return false;
    }
    const dialogRef = this.dialog.open(AddtextcopyDialogComponent, {
      width: '612px',
      maxHeight: '480px',
      position: {
        bottom: '3%',
        right: '0px',
      },
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: ['animate__animated', 'animate__slideInRight'],
      data: { groupList: this.GroupData },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      } else {
        let isGroupAdmin = localStorage.getItem('isGroupAdmin');
        this.globalSelectedGroup = result.groupId;
        this.getGroupdeatils(result.groupName, result.groupId, isGroupAdmin);
      }
    });
  }

  stopPropagationAddmember(event) {
    event.stopPropagation();
  }
  stopPropagationSearchPanel(event) {
    // this.closedSearchPanel();
    event.stopPropagation();
  }
  stopPropagationFilterPanel(event) {
    event.stopPropagation();
  }

  getOpenDueDateTooltip(taskRow): string {
    return (this.tooltipDueDateOpen = this.datepipe.transform(
      taskRow.taskDueDate,
      'MMM d, y'
    ));
  }
  getInProgressDueDateTooltip(taskRow): string {
    return (this.tooltipDueDateInprogress = this.datepipe.transform(
      taskRow.taskDueDate,
      'MMM d, y'
    ));
  }
  getDoneDueDateTooltip(taskRow): string {
    return (this.tooltipDueDateDone = this.datepipe.transform(
      taskRow.taskDueDate,
      'MMM d, y'
    ));
  }

  // get user toltip name
  getOpenUserNameTooltip(taskRow, Open: string): string {
    return (this.tooltipUserNameOpen = taskRow.userDetails.userName);
  }
  getInprogressUserNameTooltip(taskRow): string {
    return (this.tooltipUserNameInprogress = taskRow.userDetails.userName);
  }
  getDoneUserNameTooltip(taskRow): string {
    return (this.tooltipUserNameDone = taskRow.userDetails.userName);
  }

  /// get task status name
  getStatusTooltip1(taskRow): string {
    return (this.tooltipTaskStatusOpen = taskRow.taskStatus);
  }
  getStatusTooltip2(taskRow): string {
    return (this.tooltipTaskStatusInprogress = taskRow.taskStatus);
  }
  getStatusTooltip3(taskRow): string {
    return (this.tooltipTaskStatusDone = taskRow.taskStatus);
  }

  // getOpenTaskUserNameTooltip(taskRow): string {
  //   return (this.tooltipUserName = taskRow.userDetails.userName);
  // }

  editTaskDialog(taskRow) {
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      width: '812px',
      maxHeight: '580px',
      backdropClass: 'custom-dialog-backdrop-class',
      panelClass: 'custom-dialog-panel-class',
      data: { taskDetails: taskRow, groupMembers: this.groupMemberData },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      } else {
        let isGroupAdmin = localStorage.getItem('isGroupAdmin');
        this.globalSelectedGroup = result.groupId;
        this.getGroupdeatils(result.groupName, result.groupId, isGroupAdmin);
      }
    });
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
      this.getDragAndDropValues(body);
    } else if (event.container.id === 'openList') {
      let body = {
        containerName: 'openList',
        arrTaskList: dropTaskOpen,
        taskDisplayOrder: event.currentIndex,
        prevousIndex: event.previousIndex,
      };
      this.getDragAndDropValues(body);
    } else {
      let body = {
        containerName: 'doneList',
        arrTaskList: dropTaskDone,
        taskDisplayOrder: event.currentIndex,
        prevousIndex: event.previousIndex,
      };
      this.getDragAndDropValues(body);
    }
  }
  getDragAndDropValues(arrBody) {
    if (arrBody.length == 0) {
      return;
    }
    this.todoTaskService.saveDragAndDropData(arrBody).subscribe(
      (res) => {
        if (res.status === false) {
        } else {
          if (res.status === 'success') {
            // this.toastr.success('Success', res.message);
            let getGroupId = localStorage.getItem('groupId');
            let groupName = localStorage.getItem('groupName');
            let isGroupAdmin = localStorage.getItem('isGroupAdmin');
            this.getGroupdeatils(groupName, getGroupId, isGroupAdmin);
            // this.AddTaskForm.reset();
          }
        }
      },
      (error) => {
        this.toastr.error('Error', error);
      }
    );
  }

  ClosedTask(TaskId): void {
    const message = `Are you sure you want to close this task?`;
    const dialogData = new ConfirmDialogModel('Confirm Action', message);
    const dialogRef = this.dialog.open(ConfirmComponent, {
      maxWidth: '400px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      this.result = dialogResult;
      if (this.result == true) {
        if (TaskId != null || TaskId != undefined) {
          this.todoTaskService.closedTask(TaskId).subscribe(
            (res) => {
              if (res.status === false) {
                this.toastr.error('error', res.message);
              } else {
                if (res.status === 'success') {
                  this.toastr.success('Success', res.message);
                  localStorage.removeItem('taskId');
                  let isGroupAdmin = localStorage.getItem('isGroupAdmin');
                  let groupName = localStorage.getItem('groupName');
                  let getGroupId = localStorage.getItem('groupId');
                  this.getMyTasks();
                  if (this.groupTaskList.length === 0) {
                    this.getGroupdeatils(
                      groupName ? groupName : groupName,
                      getGroupId,
                      isGroupAdmin
                    );
                    this.getGroupdeatilsReloaded(getGroupId);
                  }
                }
              }
            },
            (error) => {
              this.alertService.error(error);
              this.toastr.error('Error', error);
              if (error === 'Token Expired') {
                this.router.navigate(['/']);
              }
            }
          );
        }
      }
    });
  }

  tabClick = (tabChangeEvent: MatTabChangeEvent): void => {
    // console.log('tabChangeEvent => ', tabChangeEvent);
    // console.log('index => ', tabChangeEvent.index);
  };
}
