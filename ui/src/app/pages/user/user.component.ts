import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../_services/user.service';
import { AlertService } from '../../_services/alert.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MustMatch, isArrayOfEmails, isEmail } from '../../_helpers/must-match.validator';
declare var $: any;
import { SeoService } from '../../_services/seo.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userdata: any = []; pageSize: any;
  config: any;
  totalItems = 0;
  size = 9;
  pageIndex = 0;
  collection = { data: [] };
  users: any = [];
  dataSource = [];
  inviteUsersForm: FormGroup;
  submittedUser: boolean = false;
  loading;
  loadingBtn = false;
  searchUsers = false;
  buttonName = 'Show';
  term = "";
  p : any
  message = false;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private toastr: ToastrService,
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private seo: SeoService
  ) {
    this.seo.setTags({
      title: 'Users', // Title
      titleSuffix: '- track2excel', // Title Suffix
      description: 'Users', // Description
      image: '', // Image
      keywords: 'Task, Task management' // Keywords
    });
  }

  ngOnInit(): void {
    this.getUsers();

    this.inviteUsersForm = this.formBuilder.group({
      usersEmail: new FormControl('', [isArrayOfEmails]),
    });

  }

  searchBar() {
    this.searchUsers = !this.searchUsers
    if (this.searchUsers) {
      this.buttonName = 'Hide';
    }
    else {
      this.buttonName = 'Show'
    }
  }
  getUsers() {
    this.userService.getAllUsers().subscribe((res) => {
      this.userdata = res.users;
      if (this.userdata.length == 0) {
        this.message = true;
      } else {
        this.message = false;
      }

    }, (error) => {
      this.alertService.error(error);
      if ((error) === "Token Expired") {
        this.router.navigate(['/']);
      }
    });
  }
  paginate(event: any) {
    this.pageIndex = event;
    this.dataSource = this.collection.data.slice(event * this.size - this.size, event * this.size);
  }


  get f() { return this.inviteUsersForm.controls; }
  onSubmit(inviteUsersForm) {

    this.submittedUser = true;
    if (this.inviteUsersForm.invalid) {
      return;
    }
    this.loadingBtn = true;
    var emailArr = inviteUsersForm.value.usersEmail.split(',');
    let inviteUsers = {
      usersEmail: emailArr,
      role: 'User',
      groupId: ""
    }
    this.userService.inviteUsers(inviteUsers).subscribe((res) => {
      if (res.status === false) {

      } else {
        if (res.status === 'success') {
          this.toastr.success('Success', res.message);
          this.getUsers();
          this.loadingBtn = false;
          this.inviteUsersForm.reset();
          this.inviteUsersForm;
          this.inviteUsersCloseButton()
          $("#exampleModal").modal("hide");
        }
      }
    }, (error) => {
      this.toastr.error('Error', error);
      this.alertService.error(error);
      this.loadingBtn = false;
      if ((error) === "Token Expired") {
        this.router.navigate(['/']);
      }
    });
  }

  inviteUsersCloseButton() {
    this.inviteUsersForm.reset();
    this.loadingBtn = false;
    this.submittedUser = false;
  }

  ngOnDestroy(): void {
    //this.modal.hide();
    $(document.body).removeClass("modal-open");
    $(".modal-backdrop").remove();
  }

}
