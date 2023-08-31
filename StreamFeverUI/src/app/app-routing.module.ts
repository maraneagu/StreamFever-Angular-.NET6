import { NgModule } from '@angular/core';
import { RouterModule, Routes, mapToCanActivate } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { authentificationGuard } from './guards/authentification.guard';
import { CreateGroupComponent } from './components/group/create-group/create-group.component';
import { CreateSessionComponent } from './components/session/create-session/create-session.component';
import { ReadGroupsComponent } from './components/group/read-groups/read-groups.component';
import { ReadSessionsComponent } from './components/session/read-sessions/read-sessions.component';
import { EditGroupComponent } from './components/group/edit-group/edit-group.component';

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
    path: 'createGroup',
    component: CreateGroupComponent,
  },
  {
    path: 'editGroup/:groupId',
    component: EditGroupComponent
  },
  {
    path: 'groups',
    component: ReadGroupsComponent
  },
  {
    path: 'createSession',
    component: CreateSessionComponent
  },
  {
    path: 'sessions',
    component: ReadSessionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
