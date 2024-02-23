import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from '../../../_services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
// Rxjs
import { takeUntil, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
// Components
import { UnsubscribeComponent } from '../../../component/unsubscribe/unsubscribe.component';
import { SeoService } from '../../../_services/seo.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent extends UnsubscribeComponent implements OnInit {
  registrationForm: FormGroup;
  error = '';
  submitted = false;
  isLoggedIn: boolean;
  returnUrl: string;
  showMsg: boolean = false;
  errorMsg = '';
  formData: any = [];
  public href: string = "";
  loading: boolean;
  succesMsg: boolean;
  loadingBtn = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private seo: SeoService

  ) {  
       super(); 
       this.seo.setTags({
        title: 'Register user', // Title
        titleSuffix: '- track2excel', // Title Suffix
        description: 'Register', // Description
        image: '', // Image
        keywords: 'Task, Task management' // Keywords
      });
    }

  ngOnInit(): void {
    let token = localStorage.getItem('Token');
    if (token != null) {
      this.router.navigate(['/todo-task']);
    }

    this.registrationForm = this.fb.group({
      userEmail: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userName: ['', [Validators.required]],
      code: [],
    });

    this.route.queryParams
    .pipe(
      takeUntil(this.unsubscribe$),
      map(val => val.code))
    .subscribe(code => {
      if (!code) {
        return this.router.navigate(['/todo-task']);
      }
      this.registrationForm.patchValue({ code });
    });
    this.href = this.router.url;
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.registrationForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registrationForm.invalid) {
      return;
    }
    else {
      // this.router.navigate(['/dashboard']);
      this.loadingBtn = true;
      this.formData = {
        userEmail: this.registrationForm.value.userEmail,
        password: this.registrationForm.value.password,
        userName: this.registrationForm.value.userName,
        code: this.registrationForm.value.code,
      };
      this.authService.userRegister(this.formData)
        .pipe(first())
        .subscribe(
          res => {
            if (res.status == 'success') {
              this.succesMsg = true;
              this.showMsg = false;
              this.toastr.success('Success', res.message);
              this.loadingBtn = false;
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 4000);
            }
          },
          error => {
            this.showMsg = true;
            this.succesMsg = false;
            this.errorMsg = error.message;
            this.loadingBtn = false;
            this.toastr.error('Error',error);
          });
    }

  }
}
