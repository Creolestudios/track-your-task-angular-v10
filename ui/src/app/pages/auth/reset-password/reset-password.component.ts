import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../_services/auth.service';
import { first } from 'rxjs/operators';
// Rxjs
import { takeUntil, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
// Components
import { UnsubscribeComponent } from '../../../component/unsubscribe/unsubscribe.component';
import { MustMatch } from '../../../_helpers/must-match.validator';
import { SeoService } from '../../../_services/seo.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent extends UnsubscribeComponent implements OnInit {
  resetpassForm: FormGroup;
  loading = false;
  submitted = false;
  passerrorMsg: boolean = false;
  returnUrl: string;
  showMsg: boolean = false;
  errorMsg = '';
  formData: any = [];
  public href: string = "";
  error = '';
  loadingBtn = false;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private seo: SeoService
  ) {
    super();
    this.seo.setTags({
      title: 'Reset Password', // Title
      titleSuffix: '- track2excel', // Title Suffix
      description: 'Reset Password', // Description
      image: '', // Image
      keywords: 'Task, Task management' // Keywords
    });
  }

  ngOnInit(): void {

    let token = localStorage.getItem('Token');
    if (token != null) {
      this.router.navigate(['/todo-task']);
    }

    let email = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    let passs = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    this.resetpassForm = this.formBuilder.group({
      userEmail: ['', Validators.compose([Validators.required, Validators.pattern(email)])],
      password: ['', Validators.compose([Validators.required, Validators.pattern(passs)])],
      conpassword: ['', Validators.required],
      code: [],
    }, {
      validator: MustMatch('password', 'conpassword')
    });
    this.route.queryParams
      .pipe(
        takeUntil(this.unsubscribe$),
        map(val => val.code))
      .subscribe(code => {
        if (!code) {
          return this.router.navigate(['/todo-task']);
        }
        this.resetpassForm.patchValue({ code });
      });
    this.href = this.router.url;
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.resetpassForm.controls; }

  onSubmit(resetpassForm) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.resetpassForm.invalid) {
      return;
    }
    else {
      if (resetpassForm.value.password != resetpassForm.value.conpassword) {
        this.passerrorMsg = true;
        this.loadingBtn = true;
      }
      else {
        if (resetpassForm.value.password === resetpassForm.value.conpassword) {
          this.passerrorMsg = false;
          this.formData = {
            userEmail: resetpassForm.value.userEmail,
            password: resetpassForm.value.password,
            code: resetpassForm.value.code,
          };
          this.authService.restPassword(this.formData)
            .pipe(first())
            .subscribe(
              res => {
                if (res.status == 'success') {
                  this.toastr.success('Success', res.message);
                  this.loadingBtn = false;
                  setTimeout(() => {
                    this.router.navigate(['/login']);
                  }, 3000);
                }
              },
              error => {
                this.showMsg = true;
                this.error = error;
                this.errorMsg = error;
                this.toastr.error('Error',this.errorMsg);
                this.loadingBtn = false;
              });
        }
      }
    }
  }

}
