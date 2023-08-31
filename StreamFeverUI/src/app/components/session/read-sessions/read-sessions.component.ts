import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/services/authentification/authentification.service';
import { SessionService } from 'src/app/services/session/session.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-read-sessions',
  templateUrl: './read-sessions.component.html',
  styleUrls: ['./read-sessions.component.scss']
})

export class ReadSessionsComponent implements OnInit {
  public name: string = "";
  public role!: string;

  constructor(private authentificationService: AuthentificationService,
    private userService: UserService,
    private sessionService: SessionService,
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

  home() : void {
    this.router.navigate(['home']);
  }

  logOut() : void {
    this.authentificationService.logOut();
  }
}
