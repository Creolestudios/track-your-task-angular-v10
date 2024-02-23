import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthService } from '../../../_services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { SetAuthData, SetAuthResources } from '../../../ngxs/auth/actions';
import { TokenStorageService } from '../../../_services/token-storage.service';
import { Store } from '@ngxs/store';
import { AlertService } from '../../../_services/alert.service';
import { ToastrService } from 'ngx-toastr';
import { SeoService } from '../../../_services/seo.service';
import { DataService } from './../../../_services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  private formSubmitAttempt: boolean;
  submitted = false;
  // tokenStorage: any;
  isLoggedIn: boolean;
  loading = false;
  returnUrl: string;
  error = '';
  showMsg: boolean = false;
  fieldTextType:boolean = false;
  loadingBtn = false;
  loggedIn: boolean;

  auth2: any;

  @ViewChild('loginRef', { static: true }) loginElement!: ElementRef;
  linkedInToken = "";
  linkedInCredentials = {
    clientId: "770ykxr2mys9tk",
    redirectUrl: "http://localhost:4200/linkedinlogin",
    scope: "r_liteprofile%20r_emailaddress%20w_member_social" // To read basic user profile data and email
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private tokenStorage: TokenStorageService,
    private store: Store,
    private alertService: AlertService,
    private toastr: ToastrService,
    private seo: SeoService,
    private dataService: DataService,
  ) {
    this.seo.setTags({
      title: 'Login', // Title
      titleSuffix: '- track2excel', // Title Suffix
      description: 'Login', // Description
      image: '', // Image
      keywords: 'Task, Task management' // Keywords
    });

  }

  ngOnInit() {
    this.linkedInToken = this.route.snapshot.queryParams["code"];
    this.loginForm = this.fb.group({
      userEmail: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required]]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loadingBtn = true;
    this.authService.login(this.f.userEmail.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        user => {
          this.toastr.success('Success', 'You are successfully logged in');
          this.loadingBtn = false;
          this.router.navigate(['/dashboard']);
          const apiVersion = user.loginDetails.token.apiVersion;
          const { ...authData } = user.loginDetails;
          this.tokenStorage.saveToken(authData.token.authToken);

          const { ...userdata } = user.loginDetails.firstName;
          this.tokenStorage.saveUser(userdata);
          this.isLoggedIn = true;
          this.store.dispatch(new SetAuthData(authData));
          localStorage.setItem('Token', authData.token.authToken);
          localStorage.setItem('userName', authData.userName);
          this.setDataToSessionStorage({
            // TOKEN: authData.token.authToken,
            apiVersion: apiVersion,
            userData: JSON.stringify({
              firstName: authData.firstName,
              lastName: authData.lastName,
              role: authData.role,
              isAdmin: authData.isAdmin,
              userId: authData.userId,
              isLastLogin: authData.isLastLogin,
              apiVersion
            }),
            loginResponse: JSON.stringify(authData),
          })
        },
        error => {
          this.error = error;
          this.toastr.error('Error', this.error);
          this.loading = false;
          this.showMsg = true;
          this.loadingBtn = false;
          setTimeout(() => {
            this.showMsg = false;
          }, 3000);
        });
  }
  private setDataToSessionStorage(data: any) {
    Object.keys(data).forEach((key) => {
      const value = data[key];
      window.sessionStorage.setItem(key, value);
    });
  }

  toggleFieldTextType(){
    this.fieldTextType = !this.fieldTextType;
  }

  login() {
    window.location.href = `https://www.linkedin.com/uas/oauth2/authorization?response_type=code&client_id=${this.linkedInCredentials.clientId
      }&redirect_uri=${this.linkedInCredentials.redirectUrl}&scope=${this.linkedInCredentials.scope}`;

  }
}
