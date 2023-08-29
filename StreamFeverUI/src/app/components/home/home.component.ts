import { Component, OnInit } from '@angular/core';
import { response } from 'express';
import { ApiService } from 'src/app/services/api/api.service';
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
  
  constructor(private authentificationService: AuthentificationService,
    private apiService: ApiService,
    private userService: UserService) {}

  ngOnInit() {
    this.apiService.getUsers()
    .subscribe(response => {
      this.users = response;
    });

    this.userService.getName()
    .subscribe(response => {
      let nameToken = this.authentificationService.getNameToken();
      this.name = response || nameToken;
    });
  }

  logOut() {
    this.authentificationService.logOut();
  }
}
