import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgToastModule } from 'ng-angular-popup';
import { TokenInterceptor } from './interceptors/token/token.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';

import { CreateGroupComponent } from './components/group/create-group/create-group.component';
import { ReadGroupsComponent } from './components/group/read/read-groups/read-groups.component';
import { EditGroupComponent } from './components/group/edit-group/edit-group.component';
import { ReadCreatedGroupsComponent } from './components/group/read/read-created-groups/read-created-groups.component';
import { ReadJoinedGroupsComponent } from './components/group/read/read-joined-groups/read-joined-groups.component';

import { CreateSessionComponent } from './components/session/create-session/create-session.component';
import { ReadSessionsComponent } from './components/session/read/read-sessions/read-sessions.component';
import { EditSessionComponent } from './components/session/edit-session/edit-session.component';
import { ReadCreatedSessionsComponent } from './components/session/read/read-created-sessions/read-created-sessions.component';
import { ReadAttendedSessionsComponent } from './components/session/read/read-attended-sessions/read-attended-sessions.component';
import { ReadPostsComponent } from './components/post/read-posts/read-posts.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreatePostComponent } from './components/post/create-post/create-post.component';
import { EditPostComponent } from './components/post/edit-post/edit-post.component';
import { EditCommentComponent } from './components/comment/edit-comment/edit-comment.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    CreateGroupComponent,
    CreateSessionComponent,
    ReadGroupsComponent,
    ReadSessionsComponent,
    EditGroupComponent,
    EditSessionComponent,
    ProfileComponent,
    ReadCreatedGroupsComponent,
    ReadCreatedSessionsComponent,
    ReadJoinedGroupsComponent,
    ReadAttendedSessionsComponent,
    ReadPostsComponent,
    CreatePostComponent,
    EditPostComponent,
    EditCommentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgToastModule,
    BrowserAnimationsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
})
export class AppModule { }