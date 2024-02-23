import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../_services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { SeoService } from '../../../_services/seo.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgetPasswordForm: FormGroup;
  error = '';
  submitted = false;
  isLoggedIn: boolean;
  loading = false;
  returnUrl: string;
  errorMsg = '';
  showMsg: boolean = false;
  succesMsg: boolean = false;
  loadingBtn = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private seo: SeoService

  ) {
    this.seo.setTags({
      title: 'Forgot password', // Title
      titleSuffix: '- track2excel', // Title Suffix
      description: 'Forgot password', // Description
      image: '', // Image
      keywords: 'Task, Task management' // Keywords
    });
   }

  ngOnInit(): void {
    this.forgetPasswordForm = this.fb.group({
      userEmail: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    });
  }
  get f() { return this.forgetPasswordForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.forgetPasswordForm.invalid) {
      return;
    }
    else {
      // this.router.navigate(['/dashboard']);
      this.loadingBtn = true;
      this.authService.forgotPassword(this.f.userEmail.value)
        .pipe(first())
        .subscribe(
          res => {
            if (res.status == 'success') {
              this.succesMsg = true;
              this.showMsg = false;
              this.toastr.success('Success', res.message);
              this.loadingBtn = false;
              // this.router.navigate(['/reset-password']);
            }
          },
          error => {
            this.showMsg = true;
            this.succesMsg = false;
            this.errorMsg = error;
            this.loading = false;
            this.toastr.error('Error',this.errorMsg);
            this.loadingBtn = false;
          });
    }

  }
}
