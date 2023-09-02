import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/services/authentification/authentification.service';
import { GroupService } from 'src/app/services/group/group.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  public name: string = "";
  public role!: string;
  
  constructor(private authentificationService: AuthentificationService,
    private userService: UserService,
    private groupService: GroupService,
    private router: Router) {}

  ngOnInit() {
    this.userService.getName()
    .subscribe(response => {
      let nameToken = this.authentificationService.getNameToken();
      this.name = response || nameToken;
    });

    this.userService.getRole()
    .subscribe(response => {
      let roleToken = this.authentificationService.getRoleToken();
      this.role = response || roleToken;
    })
  }

  createGroup() : void {
    this.router.navigate(['createGroup']);
  }

  createSession() : void {
    this.router.navigate(['createSession']);
  }

  groups() : void {
    this.router.navigate(['groups']);
  }

  sessions() : void {
    this.router.navigate(['sessions']);
  }

  profile() : void {
    this.userService.getIdByToken(this.authentificationService.getToken())
    .subscribe((response) =>{
      this.router.navigate(['profile', response.id]);
    })
  }

  logOut() {
    this.authentificationService.logOut();
  }
}
