import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_helpers/auth.guard';
import { DelayResolver } from './_helpers/delay-resolver';
import { LoginComponent } from './pages/auth/login/login.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TodoComponent } from './pages/todo/todo.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { UserComponent } from './pages/user/user.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { RegisterUserComponent } from './pages/user/register-user/register-user.component';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { TodoNotificationComponent } from './pages/todo/todo-notification/todo-notification.component';
import { RejectNotificationComponent } from './pages/todo/reject-notification/reject-notification.component';
import { GroupNotificationComponent } from './pages/group-notification/group-notification.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { MasterTodoComponent } from './pages/master-todo/master-todo.component';
import { HomeComponent } from './pages/home/home.component';
import { LinkedinLoginResponseComponent } from './pages/auth/linkedin-login-response/linkedin-login-response.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'todo-task', component: TodoComponent, canActivate: [AuthGuard] },
  { path: 'linkedinlogin', component: LinkedinLoginResponseComponent },
  { path: 'recursive-task', component: MasterTodoComponent, canActivate: [AuthGuard] },
  { path: 'accept-invitation', component: TodoNotificationComponent },
  { path: 'reject-invitation', component: RejectNotificationComponent },
  { path: 'auth/forgot-password', component: ForgotPasswordComponent },
  { path: 'auth/sign-up', component: SignUpComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'users/register-user', component: RegisterUserComponent },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'group-notification', component: GroupNotificationComponent, canActivate: [AuthGuard] },
  { path: 'notification', component: NotificationComponent, canActivate: [AuthGuard] },
  { path: '**', component: PageNotFoundComponent, canActivate: [AuthGuard] }
  // { path: '**', redirectTo: ''}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
