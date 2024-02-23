import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { TodoTaskService } from '../../_services/todo-task.service';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '../../_services/alert.service';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { LoaderService } from '../../_services/loader.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-addtextcopy-dialog',
  templateUrl: './addtextcopy-dialog.component.html',
  styleUrls: ['./addtextcopy-dialog.component.css']
})
export class AddtextcopyDialogComponent implements OnInit {
  isAnimate: true;
  loadingBtn;
  userErrorMsg;
  textTotextsubmitted = false
  html = "";
  AddTaskForm: FormGroup;
  textToTextForm:FormGroup;
  showMasterTaskCheckbox = false;
  groupMemberData: any = [];
  groupList: any = [];
  mentionConfig: any;
  items: any[] = [];
  taskText: string;
  fileContent: any = '';
  textNewLine: boolean;
  selected:string;

  config = {
    height: '3rem',
    minHeight: '5rem',
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
  errorMsg: string;

  constructor(public dialog: MatDialog, private fb: FormBuilder, private toastr: ToastrService, public datepipe: DatePipe,
    private todoTaskService: TodoTaskService,
    private alertService: AlertService, public dialogRef: MatDialogRef<AddtextcopyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.groupList = data.groupList;

      this.mentionConfig = {
        mentions: [
          {
            items: [{ tag: '@a - Assignee (/ will give you all the list of assignees)', display: '@a ', position: 5, type: 'operator' },
            { tag: '@d - Due date (Please enter in dd/mm/yyyy format)', display: '@d ', position: 1, type: 'operator' },
            { tag: '@e - End of task', display: '@e ', position: 5, type: 'operator' }],
            labelKey: 'tag',
            triggerChar: '@',
            disableSort: true,
            mentionSelect: this.itemMentioned
          },
          {
            items: this.items,
            labelKey: 'tag',
            triggerChar: '/',
            disableSort: true,
            mentionSelect: this.itemMentioned
          },
        ]
      }
  }
  itemMentioned(tag) {
    if (tag.display == "@e ") {
      this.textNewLine = true;
    }
    return tag.display;
  }
  eventHandler(event) {
    if (this.textNewLine == true) {
      var textarea = this.textToTextForm.value.taskText;
      this.taskText = textarea + '\r';
    }
    if (event.keyCode == 47) {
      this.getGroupMembers(this.selected)
      this.mentionConfig = {
        mentions: [
          {
            items: [{ tag: '@a - Assignee (# will give you all the list of assignees)', display: '@a ', position: 5, type: 'operator' },
            { tag: '@d - Due date (Please enter in dd/mm/yyyy format)', display: '@d ', position: 1, type: 'operator' },
            { tag: '@e - End of task', display: '@e ', position: 5, type: 'operator' }],
            labelKey: "tag",
            disableSort: true,
            triggerChar: '@',
            mentionSelect: this.itemMentioned
          },
          {
            items: this.items,
            labelKey: "tag",
            disableSort: true,
            triggerChar: '/',
            mentionSelect: this.itemMentioned
          }]
      }
    }
  }
  ngOnInit() {
    let groupId = localStorage.getItem('groupId');
    this.selected = groupId || null;
    this.textToTextForm = this.fb.group({
      taskText: ['', [Validators.required]],
      groupId: ['', [Validators.required]],
    })
  }

  get t() { return this.textToTextForm.controls; }
  addTextToTextTask(textToTextForm) {
    this.textTotextsubmitted = true;
    if (this.textToTextForm.invalid) {
      return;
    }
    let textBody = {
      taskText: this.textToTextForm.value.taskText,
      isUploaded: false,
      groupId: this.textToTextForm.value.groupId
    }
    this.todoTaskService.addTextToTextTask(textBody).subscribe((res) => {
      if (res.status === false) {
      } else {
        if (res.status === 'success') {
          this.toastr.success('Success', res.message);
          this.loadingBtn = false;
          let taskClosedCall = {
            groupId: this.textToTextForm.value.groupId,
            groupName: this.textToTextForm.value.groupName,
          }
          this.dialogRef.close(taskClosedCall);
          this.textToTextForm.reset();
        }
      }
    }, (error) => {
      this.toastr.error('Error', error);
    });
  }

  @ViewChild('fileUploader', { static: false }) fileUploader: ElementRef;
  resetFileUploader() {
    this.fileUploader.nativeElement.value = "";
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
      }

      myReader.readAsText(file);
      this.fileContent = myReader.result;
      setTimeout(() => {
        let textFileData = localStorage.getItem('fileContent');
        this.getData(textFileData);
      }, 1000);
    } else {
      this.errorMsg = 'File type should be .txt';
      this.resetFileUploader();
      localStorage.removeItem('fileContent')
      setTimeout(() => {
        this.errorMsg = "";
      }, 3000);
    }
  }

  getData(textdata) {
    this.selected
    if (this.selected === "" || this.selected == null) {
      this.errorMsg = 'Please select group';
      this.resetFileUploader()
      return;
    } else {
      this.errorMsg = '';
    }
    if (textdata == "" || textdata == null) {
      this.errorMsg = 'File should not be empty';
      this.resetFileUploader();
      localStorage.removeItem('fileContent')
      setTimeout(() => {
        this.errorMsg = "";
      }, 3000);
      return
    } else {
      let body = {
        taskText: this.fileContent,
        isUploaded: true,
        groupId: this.selected
      }
      this.todoTaskService.addTextToTextTask(body).subscribe((res) => {
        if (res.status === false) {
        } else {
          if (res.status === 'success') {
            this.toastr.success('Success', res.message);
            this.resetFileUploader();
            localStorage.removeItem('fileContent');
            let taskClosedCall = {
              groupId: this.selected,
              groupName: localStorage.getItem('groupName'),
            }
            this.dialogRef.close(taskClosedCall);
          }
        }
      }, (error) => {
        this.resetFileUploader()
        this.toastr.error('Error', error);
        this.loadingBtn = false;
        localStorage.removeItem('fileContent')
      });
    }
    this.resetFileUploader();
    localStorage.removeItem('fileContent')
  }

  close(): void {
    this.dialogRef.close();
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

      });
    }
  }


}
