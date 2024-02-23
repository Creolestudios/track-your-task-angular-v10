import {
  Component,
  OnInit,
  Inject,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogConfig,
} from '@angular/material/dialog';
import { TodoTaskService } from '../../../_services/todo-task.service';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '../../../_services/alert.service';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { LoaderService } from '../../../_services/loader.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EditMasterDialogComponent } from '../master-edit-dialog/editmaster-dialog.component';

@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.css'],
})
export class CommentDialogComponent implements OnInit {
  quickSpinner = false;
  isAnimate: true;
  html = '';
  addCommentForm: FormGroup;
  loadingBtn;
  iconVisible: boolean = false;
  msgEditModel: boolean = false;
  editModelMsg:string;

  config = {
    height: 10,
    menubar: false,
    plugins: [
      'advlist autolink lists link image charmap print preview anchor',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime media table paste code help wordcount',
    ],
    toolbar:
      'undo redo | formatselect | ' +
      'bold italic backcolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ',
  };

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private todoTaskService: TodoTaskService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<EditMasterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // this.masterTaskRow = data.masterTaskRow;
    // this.groupMemberData = data.groupMembers;
  }

  ngOnInit() {
    const groupName = localStorage.getItem('groupName');
    this.addCommentForm = this.fb.group({

    });
  }

  saveComment() {}

  updateComment() {
    this.msgEditModel = true;
    this.editModelMsg = 'These utility classes float an element to the left or right, or disable floating, based on the current viewport size using the'
    console.log('edit fnc');
  }

  cancelComment(){
    console.log('cancelComment fnc');
  this.msgEditModel = false;
  }

  mouseEnter() {
    console.log('mouse enter');
    this.iconVisible = true;
  }

  mouseLeave() {
    console.log('mouse leave');
    this.iconVisible = false;
  }

  close(): void {
    this.dialogRef.close();
  }
}
