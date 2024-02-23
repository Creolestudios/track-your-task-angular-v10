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
  selector: 'app-todo-dialog',
  templateUrl: './todo-dialog.component.html',
  styleUrls: ['./todo-dialog.component.css']
})
export class TodoDialogComponent implements OnInit {
  taskId: string;
  taskDetails: any;
  userName: any;
  userEmail: any;
  taskDescription: any;
  taskDueDate: any;
  taskStatus: any;
  TaskId: any;
  taskDueDateFormat: any;
  taskClassDescription: boolean = false;
  isTaskOverDue = false;
  createdAt: any;
  createdBy: any;
  constructor( private router: Router,private datePipe: DatePipe, private loader: LoaderService, public datepipe: DatePipe, private todoTaskService: TodoTaskService, private toastr: ToastrService,
    private alertService: AlertService, public dialogRef: MatDialogRef<TodoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.taskDetails = data.pageValue;
      this.taskDueDateFormat = this.datePipe.transform(this.taskDetails.taskDueDate);
      this.userName = this.taskDetails.userDetails.userName ? this.taskDetails.userDetails.userName : 'No assignee';
      this.userEmail = this.taskDetails.userDetails.userEmail;
      this.taskDescription = this.taskDetails.taskDescription;
      this.taskDueDate = this.taskDueDateFormat ? this.taskDueDateFormat : 'No due date';
      this.taskStatus = this.taskDetails.taskStatus;
      this.TaskId = this.taskDetails.taskId;
      this.isTaskOverDue = this.taskDetails.isTaskOverDue;
      this.createdAt = this.taskDetails.createdAt;
      this.createdBy = this.taskDetails.createdUserDetails.userName
  }

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close();
  }
 
}
