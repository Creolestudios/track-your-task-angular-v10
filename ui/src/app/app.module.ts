import { BrowserModule } from '@angular/platform-browser';
import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './app-material/app-material.module';
import { FlexLayoutModule } from "@angular/flex-layout";
import { HTTP_INTERCEPTORS,HttpClientModule } from '@angular/common/http';
import {MAT_SNACK_BAR_DATA} from '@angular/material/snack-bar';
//datepicker
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
//adding pagination
import { NgxPaginationModule } from 'ngx-pagination';
//filter pipe
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ShortNamePipe } from './_helpers/short-name.pipe';
//@mention

// import { SocialLoginModule } from 'angularx-social-login';
// import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
// import {
//   GoogleLoginProvider,
//   FacebookLoginProvider
// } from 'angularx-social-login';

import { NgxsModule } from '@ngxs/store';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { FilterPipe } from './_helpers/filter.pipe';
import { NoSanitizePipe } from './_helpers/no-sanitize.pipe';
import { TaskPipe } from './_helpers/task.pipe';
import { FavPipe } from './_helpers/fav.pipe';
import { TrimPipe } from './_helpers/trim.pipe';
import { SortByPipe } from './_helpers/sort-by.pipe'
//guard
import { AuthGuard } from './_helpers/auth.guard';
//services
import { AuthService } from './_services/auth.service';
import { DataService } from './_services/data.service';
import { DialogService } from './_services/dialog.service';
import { LoaderInterceptor } from './_services/loader.interceptor';
import { OverlayService } from './_services/overlay.service';
import { SeoService } from './_services/seo.service';
import { SpinnerService } from './_services/spinner.service';
import { OnlyNumberDirective } from './_helpers/only-number.directive';
// charts
import { HighchartsChartModule } from 'highcharts-angular';

import { LoginComponent } from './pages/auth/login/login.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { MenuComponent } from './pages/layout/menu/menu.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TodoComponent } from './pages/todo/todo.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import * as $ from 'jquery';
import { UserComponent } from './pages/user/user.component';
import { AdduserComponent } from './pages/dialog/adduser.component';
import { ConfirmDialogComponent } from './pages/dialog/confirm-dialog.component';
import { ConfirmDialog2Component } from './pages/dialog/confirm-dialog2.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { RegisterUserComponent } from './pages/user/register-user/register-user.component';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { TodoDialogComponent } from './pages/dialog/todo-dialog.component';
import { SnackbarComponent } from './component/snackbar.component';
import { NewGroupUserComponent } from './pages/dialog/new-group-user.component';
import { TodoNotificationComponent } from './pages/todo/todo-notification/todo-notification.component';
import { RejectNotificationComponent } from './pages/todo/reject-notification/reject-notification.component';
import { NgxTinymceModule } from 'ngx-tinymce';
import { GroupNotificationComponent } from './pages/group-notification/group-notification.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { ConfirmComponent } from './pages/dialog/confirm.component';
import { MasterTodoComponent } from './pages/master-todo/master-todo.component';
import { MasterTodoAddEditComponent } from './pages/master-todo/master-todo-add-edit/master-todo-add-edit.component';
import { MasterTodoTaskComponent } from './pages/master-todo/master-todo-task/master-todo-task.component';
import { MasterTodoDialogComponent } from './pages/dialog/master-todo-dialog.component'
import { MentionModule } from 'angular-mentions';
import { HomeComponent } from './pages/home/home.component';
import { TourMatMenuModule } from 'ngx-tour-md-menu';
import { AddtaskDialogComponent } from './pages/dialog/addtask-dialog.component';
import { AddtextcopyDialogComponent } from './pages/dialog/addtextcopy-dialog.component';
import { AddMasterTaskDialogComponent } from './pages/dialog/master-task/addmastertask-dialog.component';
import { TaskAddComponent } from './pages/quick-component/task-add/task-add.component';
import { TaskListComponent } from './pages/quick-component/task-list/task-list.component';
import { EditTaskDialogComponent } from './pages/dialog/task-edit-dialog/edittask-dialog.component';
import { SpinnerComponent } from './pages/quick-component/spinner/spinner.component';
import { EditMasterDialogComponent } from './pages/dialog/master-edit-dialog/editmaster-dialog.component';
import { GroupChartComponent } from './pages/dashboard/group-chart/group-chart.component';
import { MytaskComponent } from './pages/dashboard/mytask/mytask.component';
import { MainGroupComponent } from './pages/dashboard/main-group/main-group.component';
import { environment } from 'src/environments/environment';
import { LinkedinLoginResponseComponent } from './pages/auth/linkedin-login-response/linkedin-login-response.component';
import { TodoGroupComponent } from './pages/todo/todo-group/todo-group.component';
import { ClosedTaskListComponent } from './pages/quick-component/closed-task-list/closed-task-list.component';
import { MyAssignComponent } from './pages/quick-component/my-assign/my-assign.component';
import { MAT_SELECT_SCROLL_STRATEGY_PROVIDER } from '@angular/material/select';
import { CommentComponent } from './pages/quick-component/comment/comment.component';
import { CommentDialogComponent } from './pages/dialog/comment-dialog/comment-dialog.component';
import {MatIconModule} from '@angular/material/icon';
const CLIENT_ID = environment.client_Id;


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    MenuComponent,
    DashboardComponent,
    ProfileComponent,
    TodoComponent,
    PageNotFoundComponent,
    UserComponent,
    AdduserComponent,
    ResetPasswordComponent,
    RegisterUserComponent,
    SignUpComponent,
    SnackbarComponent,
    ConfirmDialogComponent,
    TodoDialogComponent,
    FilterPipe,
    ConfirmDialog2Component,
    NewGroupUserComponent,
    TodoNotificationComponent,
    RejectNotificationComponent,
    NoSanitizePipe,
    GroupNotificationComponent,
    TaskPipe,
    NotificationComponent,
    FavPipe,
    ConfirmComponent,
    MasterTodoComponent,
    MasterTodoAddEditComponent,
    MasterTodoTaskComponent,
    MasterTodoDialogComponent,
    OnlyNumberDirective,
    HomeComponent,
    AddtaskDialogComponent,
    AddtextcopyDialogComponent,
    AddMasterTaskDialogComponent,
    ShortNamePipe,
    TaskAddComponent,
    TaskListComponent,
    EditTaskDialogComponent,
    SpinnerComponent,
    EditMasterDialogComponent,
    GroupChartComponent,
    MytaskComponent,
    TrimPipe,
    SortByPipe,
    MainGroupComponent,
    LinkedinLoginResponseComponent,
    TodoGroupComponent,
    ClosedTaskListComponent,
    MyAssignComponent,
    CommentComponent,
    CommentDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    NgSelectModule,
    MatIconModule,
    MentionModule,
    ToastrModule.forRoot(),
    NgxsModule.forRoot([
    ]),
    BsDatepickerModule.forRoot(),
    CommonModule,
    NgxTinymceModule.forRoot({
      baseURL: '//cdnjs.cloudflare.com/ajax/libs/tinymce/4.9.0/',
    }),
    TourMatMenuModule.forRoot(),
    HighchartsChartModule,
    MatIconModule
  ],
  exports: [ConfirmDialogComponent,ConfirmDialog2Component,ConfirmComponent,CommentDialogComponent],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },DataService,AuthService, AuthGuard,DatePipe,{ provide: MAT_SNACK_BAR_DATA,useClass: LoaderInterceptor, multi: true, useValue: {} },
    DialogService,OverlayService,SeoService,SpinnerService,
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
    ],
  entryComponents: [CommentDialogComponent,EditMasterDialogComponent,EditTaskDialogComponent,AddMasterTaskDialogComponent,AddtextcopyDialogComponent,AddtaskDialogComponent,MasterTodoDialogComponent,ConfirmComponent,AdduserComponent,SnackbarComponent,ConfirmDialogComponent,TodoDialogComponent,ConfirmDialog2Component,NewGroupUserComponent],
  bootstrap: [AppComponent]

})
export class AppModule { }
