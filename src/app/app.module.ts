import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {BaseRequestOptions, HttpModule} from "@angular/http";

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MaterialModule} from "@angular/material";
import {FlexLayoutModule} from "@angular/flex-layout";

import "hammerjs";
import {LoginComponent} from "./login/login.component";
import {ProfileComponent} from "./profile/profile.component";
import {AlertComponent} from "./alert/alert.component";
import {AlertService} from "./alert.service";
import {AccountService} from "./account.service";
import {AuthenticationService} from "./authentication.service";
import {AuthGuard} from "./auth.guard";
import {fakeBackendProvider} from "./fake-backend";
import {MockBackend} from "@angular/http/testing";
import {RegisterComponent} from "./register/register.component";
import {HomeComponent} from "./home/home.component";
import {routing} from "./app.routing";
import {StudentComponent} from "./student/student.component";
import {TeacherComponent} from "./teacher/teacher.component";
import {ManagerComponent} from "./manager/manager.component";
import {AppComponent} from "./app.component";
import {AdminComponent} from "./admin/admin.component";

@NgModule({
  declarations: [
    LoginComponent,
    ProfileComponent,
    AlertComponent,
    RegisterComponent,
    HomeComponent,
    StudentComponent,
    TeacherComponent,
    ManagerComponent,
    AdminComponent,
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    MaterialModule,
    FlexLayoutModule,
    BrowserAnimationsModule
  ],
  providers: [
    AccountService,
    AlertService,
    AuthenticationService,
    AuthGuard,
    AccountService,

    // providers used to create fake backend
    fakeBackendProvider,
    MockBackend,
    BaseRequestOptions],
  entryComponents: [ProfileComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
