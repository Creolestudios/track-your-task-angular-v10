import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../_services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { MustMatch,isArrayOfEmails,isEmail,removeSpaces } from '../../../_helpers/must-match.validator';
import { ToastrService } from 'ngx-toastr';
import { SeoService } from '../../../_services/seo.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent  implements OnInit {
  signUpForm: FormGroup;
  error: string = '';
  submitted = false;
  isLoggedIn: boolean;
  isMatch:boolean;
  returnUrl: string;
  showMsg: boolean = false;
  errorMsg = '';
  formData: any = [];
  public href: string = "";
  loading: boolean;
  trueValue = true;
  succesMsg: boolean;
  loadingBtn = false;
  fieldTextType:boolean;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr : ToastrService,
    private seo: SeoService

  ) {
    this.seo.setTags({
      title: 'Register User', // Title
      titleSuffix: '- track2excel', // Title Suffix
      description: 'Register User', // Description
      image: '', // Image
      keywords: 'Task, Task management' // Keywords
    });
   }

  ngOnInit(): void {
    const passsValidationRegx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      // userEmail: ['', Validators.compose([Validators.required, Validators.pattern(email)])],
    this.signUpForm = this.fb.group({
      userEmail: ['', Validators.compose([Validators.required, Validators.pattern(emailPattern)])],
      password: ['', Validators.compose([Validators.required,Validators.pattern(passsValidationRegx)])],
      password2:['',[Validators.required] ],
      userName: ['', [Validators.required]],
      code: [],
    });
    this.fieldTextType = false;
    this.isMatch = false;
    this.trueValue = true;


  }
  get f() { return this.signUpForm.controls; }

  toggleFieldTextType(){
    this.fieldTextType = !this.fieldTextType;
  }

  checkMatch(){
    let pass1:string = this.signUpForm.value.password;
    let pass2:string = this.signUpForm.value.password2;
    this.isMatch = pass2.split('').filter((value)=>{ return pass1.includes(value)  }) && pass1.length == pass2.length;
  }

  onSubmit(signUpForm) {
    this.submitted = true;
    let fPass = this.signUpForm.value.password;
    let sPass = this.signUpForm.value.password2;

    if (this.signUpForm.invalid) {
      return;
    }
    else if(fPass !== sPass){
      this.isMatch = true;
      return;
    }
    else {
      this.loadingBtn = true;
      this.formData = {
        userEmail: this.signUpForm.value.userEmail,
        password: this.signUpForm.value.password,
        userName: this.signUpForm.value.userName,
      };
      this.authService.signupUser(this.formData)
        .pipe(first())
        .subscribe(
          res => {
            if (res.status === 'success') {
              this.toastr.success('Success',  res.message);
              this.succesMsg = true;
              this.showMsg = false;
              this.loadingBtn = false;
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 4000);
            }
          },
          error => {
            this.error = error;
            this.toastr.error('Error',this.error);
            this.showMsg = true;
            this.succesMsg = false;
            setTimeout(() => {
              this.error = '';
            }, 4000);
            this.loadingBtn = false;
          });
    }

    this.isMatch = false;;
  }

  get passwordMatchError(){
    return (
      this.signUpForm.getError('mismatch') && this.signUpForm.get('password2').touched
    )
  }

}
