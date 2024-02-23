import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { TodoTaskService } from '../../_services/todo-task.service';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '../../_services/alert.service';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { LoaderService } from '../../_services/loader.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-master-todo-dialog',
  templateUrl: './master-todo-dialog.component.html',
  styleUrls: ['./master-todo-dialog.component.css']
})
export class MasterTodoDialogComponent implements OnInit {
  taskId: string;
  frequency: any;
  userName: any;
  userEmail: any;
  taskDescription: any;
  recurringEndDate: any;
  dueDays: any;
  TaskId: any;
  taskDueDateFormat: any;
  taskClassDescription: boolean = false;
  isTaskOverDue = false;
  createdAt: any;
  createdBy: any;
  masterTaskDetails: any;
  recurringEndDateFormat: any;
  // isLoading: Subject<boolean> = this.loader.isLoading;
  constructor( private router: Router,private datePipe: DatePipe, private loader: LoaderService, public datepipe: DatePipe, private todoTaskService: TodoTaskService, private toastr: ToastrService,
    private alertService: AlertService, public dialogRef: MatDialogRef<MasterTodoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.masterTaskDetails = data.pageValue;
    this.taskDescription = this.masterTaskDetails.taskDescription;
    this.recurringEndDate = this.masterTaskDetails.recurringEndDate;
    this.frequency = this.masterTaskDetails.frequency;;
    this.userEmail = this.masterTaskDetails.userDetails.userEmail;
    this.createdBy = this.masterTaskDetails.createdBy;
    this.createdAt = this.masterTaskDetails.createdAt;
    this.userName = this.masterTaskDetails.userDetails.userName ? this.masterTaskDetails.userDetails.userName : 'No assignee';
    this.recurringEndDate = this.datePipe.transform(this.masterTaskDetails.recurringEndDate);
    this.recurringEndDateFormat = this.recurringEndDate ? this.recurringEndDate : 'No recurring end date';
    this.dueDays = this.masterTaskDetails.dueDay;
  }

  ngOnInit() {
  }


  close(): void {
    this.dialogRef.close();
  }

  ngAfterViewInit() {
    // this.isLoading.next(false);
  }
}
