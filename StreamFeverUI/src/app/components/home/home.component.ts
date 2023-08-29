import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/services/authentification/authentification.service';
import { UserService } from 'src/app/services/user/user.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  public users: any = [];
  public name: string = "";
  public role!: string;
  
  constructor(private authentificationService: AuthentificationService,
    private userService: UserService,
    private router: Router) {}

  ngOnInit() {
    this.userService.getUsers()
    .subscribe(response => {
      this.users = response;
    });

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

  logOut() {
    this.authentificationService.logOut();
  }
}
