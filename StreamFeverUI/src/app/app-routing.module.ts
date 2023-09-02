import { NgModule } from '@angular/core';
import { RouterModule, Routes, mapToCanActivate } from '@angular/router';
import { authentificationGuard } from './guards/authentification.guard';

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
import { CreatePostComponent } from './components/post/create-post/create-post.component';
import { EditPostComponent } from './components/post/edit-post/edit-post.component';

// DEFINING THE ROUTES FOR THE APP
const routes: Routes = [
  // WHEN WE FIRST RUN THE APP, WE WILL BE TAKEN TO THE LOGIN PAGE
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authentificationGuard]
  },
  {
    path: 'profile/:userId',
    component: ProfileComponent,
    canActivate: [authentificationGuard]
  },
  {
    path: 'createGroup',
    component: CreateGroupComponent,
    canActivate: [authentificationGuard]
  },
  {
    path: 'createdGroups',
    component: ReadCreatedGroupsComponent,
    canActivate: [authentificationGuard]
  },
  {
    path: 'editGroup/:groupId',
    component: EditGroupComponent,
    canActivate: [authentificationGuard]
  },
  {
    path: 'joinedGroups',
    component: ReadJoinedGroupsComponent,
    canActivate: [authentificationGuard]
  },
  {
    path: 'groups',
    component: ReadGroupsComponent,
    canActivate: [authentificationGuard]
  },
  {
    path: 'createPost/:groupId',
    component: CreatePostComponent,
    canActivate: [authentificationGuard]
  },
  {
    path: 'editPost/:postId',
    component: EditPostComponent,
    canActivate: [authentificationGuard]
  },
  {
    path: 'posts/:groupId',
    component: ReadPostsComponent,
    canActivate: [authentificationGuard]
  },
  {
    path: 'createSession',
    component: CreateSessionComponent,
    canActivate: [authentificationGuard]
  },
  {
    path: 'createdSessions',
    component: ReadCreatedSessionsComponent,
    canActivate: [authentificationGuard]
  },
  {
    path: 'editSession/:sessionId',
    component: EditSessionComponent,
    canActivate: [authentificationGuard]
  },
  {
    path: 'attendedSessions',
    component: ReadAttendedSessionsComponent,
    canActivate: [authentificationGuard]
  },
  {
    path: 'sessions',
    component: ReadSessionsComponent,
    canActivate: [authentificationGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
