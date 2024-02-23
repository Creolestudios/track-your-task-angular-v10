import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { SeoService } from '../../../_services/seo.service';
import { takeUntil, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { UnsubscribeComponent } from '../../../component/unsubscribe/unsubscribe.component';
import { TodoTaskService } from '../../../_services/todo-task.service';

@Component({
  selector: 'app-todo-notification',
  templateUrl: './todo-notification.component.html',
  styleUrls: ['./todo-notification.component.css']
})
export class TodoNotificationComponent extends UnsubscribeComponent implements OnInit {
  public href: string = "";
  returnUrl: string;
  acceptInvitationForm: FormGroup;
  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private seo: SeoService,
    private router: Router,
    private route: ActivatedRoute,
    private todoTaskService: TodoTaskService
  ) {  super();  }

  ngOnInit(): void {
    let token = localStorage.getItem('Token');
    if (token != null) {
      this.router.navigate(['/login']);
    }
    this.acceptInvitationForm = this.fb.group({
      code: ['']
    });

    this.route.queryParams
      .pipe(
        map(val => val.code))
      .subscribe(code => {
        if (!code) {
          return this.router.navigate(['/login']);
        }
        // this.acceptInvitationForm.patchValue({ code });
        let body = {
          code: code
        }
        if (code) {
          this.todoTaskService.acceptInvitation(body).subscribe((res) => {
            if (res.status === false) {
            } else {
              if (res.status === 'success') {
                this.toastr.success('Success', res.message);
                return this.router.navigate(['/login']);
              }
            }
          }, (error) => {
            this.toastr.error('Error', error);
            return this.router.navigate(['/login']);
          });
        }
      });
    this.href = this.router.url;
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

}
