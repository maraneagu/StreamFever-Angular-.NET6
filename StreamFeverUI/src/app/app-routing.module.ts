import { NgModule } from '@angular/core';
import { RouterModule, Routes, mapToCanActivate } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { authentificationGuard } from './guards/authentification.guard';
import { CreateGroupComponent } from './components/group/create/create-group/create-group.component';

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
    component: CreateGroupComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
