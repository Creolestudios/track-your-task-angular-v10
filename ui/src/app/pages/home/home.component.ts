import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@app/_services/user.service';
import { ToastrService } from 'ngx-toastr';
import { SeoService } from '../../_services/seo.service';
// import * as $ from 'jquery';
declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loadAPI;
  url
  contactUs: FormGroup;
  submitted = false;
  loadingBtn = false;
  currentYear: number = new Date().getFullYear();

  constructor(private userService: UserService,
    private fb: FormBuilder,
    public router: Router,
    private toastr: ToastrService,
    private elementRef: ElementRef, @Inject(DOCUMENT) private doc,
    private seo: SeoService) { }

  ngOnInit(): void {
    this.seo.setTags({
      title: 'Todo Task', // Title
      titleSuffix: '- track2excel', // Title Suffix
      description: 'Task2Excel- Simple & easy to use Task management app, Collaborate as a team with different group, Support for corporate group creation with custom domain, Ability to create recurring todo item, Easy to note editor and upload text functionality, Automated reminders for tasks', // Description
      image: '', // Image
      keywords: 'Task, Task management' // Keywords
    });
    this.contactUs = this.fb.group({
      userEmail: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      userName: ['',Validators.required],
      subject: ['',Validators.required],
      message: [''],
      contactNo: ['']
    });


    let element: HTMLElement = document.getElementById('auto_trigger') as HTMLElement;
    // add this condition will solve issue
    if (element) {
      element.click();
    }

    // window.location.reload()
    // this.loadAPI = new Promise(resolve => {
    //   console.log("resolving promise...");
    //   this.loadScript();
    // });
    // $.getScript('../assets/asset/js/main.js');
    // window.sessionStorage.clear();
    // window.localStorage.clear();
    // this.redirectTo(this.router.navigate(['/home']))
    var s1 = document.createElement("script");
    var s2 = document.createElement("script");
    var s3 = document.createElement("script");
    s1.type = "text/javascript";
    s2.src = "../assets/asset/js/plugins/jquery.2.1.0.min.js";
    s3.src = "../assets/asset/js/plugins/splitting.js";
    s1.src = "../assets/asset/js/main.js";
    this.elementRef.nativeElement.appendChild(s1);
    this.elementRef.nativeElement.appendChild(s2);
    this.elementRef.nativeElement.appendChild(s3);
    this.preloadr()
  }
  //   public loadScript() {
  //     debugger
  //     console.log("preparing to load...");
  //     let node = document.createElement("script");
  //     node.src = "../assets/asset/js/plugins/splitting.js";
  //     node.type = "text/javascript";
  //     node.async = true;
  //     node.charset = "utf-8";
  //     document.getElementsByTagName("head")[0].appendChild(node);
  // }

  preloadr() {
    var preloader = $('.mesh-loader');
    if (preloader.length) {
      preloader.delay(200).fadeOut(500);
    }
    preloader.delay(200).fadeOut(500);
  }

  ngAfterViewInit() {
    // const hostElem = this.elementRef.nativeElement;
    // console.log(hostElem.children);
    // console.log(hostElem.parentNode);
    // var s1 = document.createElement("script");
    // var s2 = document.createElement("script");
    // var s3 = document.createElement("script");
    // s1.type = "text/javascript";
    // s2.src = "../assets/asset/js/plugins/jquery.2.1.0.min.js";
    // s3.src = "../assets/asset/js/plugins/splitting.js";
    // s1.src = "../assets/asset/js/main.js";
    // this.elementRef.nativeElement.appendChild(s1);
    // this.elementRef.nativeElement.appendChild(s2);
    // this.elementRef.nativeElement.appendChild(s3);
  }
  ngAfterInit() {
    var s1 = document.createElement("script");
    var s2 = document.createElement("script");
    var s3 = document.createElement("script");
    s1.type = "text/javascript";
    s2.src = "../assets/asset/js/plugins/jquery.2.1.0.min.js";
    s3.src = "../assets/asset/js/plugins/splitting.js";
    s1.src = "../assets/asset/js/main.js";
    this.elementRef.nativeElement.appendChild(s1);
    this.elementRef.nativeElement.appendChild(s2);
    this.elementRef.nativeElement.appendChild(s3);
  }

  get f() { return this.contactUs.controls; }
  onSubmit(contactUs) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.contactUs.invalid) {
      return;
    }
    this.userService.contactUS(contactUs.value).subscribe((res) => {
      this.toastr.success('Success', res.message);
      this.loadingBtn = false;
      this.contactUs.reset();
      Object.keys(contactUs.controls).forEach(key => {
        contactUs.get(key).setErrors(null) ;
      });

    }, (error) => {
      this.toastr.error('Error', error);
      this.loadingBtn = false;
      if ((error) === "Token Expired") {
        this.router.navigate(['/']);
      }
    });
  }
}
