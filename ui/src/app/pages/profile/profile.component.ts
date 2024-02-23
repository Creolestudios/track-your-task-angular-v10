import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MustMatch } from '../../_helpers/must-match.validator';
import { AlertService } from '../../_services/alert.service';
import { UserService } from '../../_services/user.service';
import { setValue } from '@ngxs/store';
import { SeoService } from '../../_services/seo.service';
import { CustomValidator } from '../../_helpers/custom.validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  changepassFrom: FormGroup;
  changeProfileFrom: FormGroup;
  submitted = false;
  userSubmitted = false;
  loading = false;
  userName: string;
  loadingBtn = false;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private alertService: AlertService,
    private userService: UserService,
    private seo: SeoService,
    private router: Router
  ) {
    this.seo.setTags({
      title: 'Profile', // Title
      titleSuffix: '- track2excel', // Title Suffix
      description: 'Profile', // Description
      image: '', // Image
      keywords: 'Task, Task management' // Keywords
    });

  }

  ngOnInit(): void {
    let passs = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    this.changepassFrom = this.fb.group({
      password: ['', Validators.required],
      newPassword: ['', Validators.compose([Validators.required, Validators.pattern(passs)]), Validators.minLength(6)],
      confirmPassword: ['', Validators.required]
    },
      {
        validator: MustMatch('newPassword', 'confirmPassword')
      });

    this.changeProfileFrom = this.fb.group({
      userName: ['', [/*Validators.minLength(2),*/CustomValidator.trimRequired]],
    });
    this.userName = localStorage.getItem('userName');
    let userNameData = {
      userName: this.userName
    }
    this.changeProfileFrom.setValue(userNameData);
  }

  get f() { return this.changepassFrom.controls; }
  onSubmit(changepassFrom) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.changepassFrom.invalid) {
      return;
    }
    else {
      if (changepassFrom.value.newPassword != changepassFrom.value.confirmPassword) {
        this.loadingBtn = true;


      }
      else {
        if (changepassFrom.value.newPassword === changepassFrom.value.confirmPassword) {
          this.userService.changePassword(changepassFrom.value).subscribe((res) => {
            this.toastr.success('Success', res.message);
            this.loadingBtn = false;

          }, (error) => {
            this.toastr.error('Error', error);
            this.loadingBtn = false;
            if ((error) === "Token Expired") {
              this.router.navigate(['/']);
            }
          });
        }
      }
    }
  }

  get g() { return this.changeProfileFrom.controls; }
  updateUserProfile(changeProfileFrom) {
    this.userSubmitted = true;
    // stop here if form is invalid
    if (this.changeProfileFrom.invalid) {
      return;
    }
    this.loadingBtn = true;
    this.userService.updateUserProfile(this.changeProfileFrom.value).subscribe((res) => {
      if (res.status === false) {
        this.toastr.error('error', res.message);
      } else {
        if (res.status === 'success') {
          this.toastr.success('Success', res.message);
          localStorage.setItem('userName', changeProfileFrom.value.userName);
          this.loadingBtn = false;
        }
      }

    }, (error) => {
      this.alertService.error(error);
      this.toastr.error('Error', error);
      if ((error) === "Token Expired") {
        this.router.navigate(['/']);
      }
      this.loadingBtn = false;
    });
  }

  cancelPassForm(){
    this.changepassFrom.reset()
  }
}
