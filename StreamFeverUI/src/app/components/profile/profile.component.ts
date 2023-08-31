import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Group } from 'src/app/models/group.model';
import { Session } from 'src/app/models/session.model';
import { User } from 'src/app/models/user.model';
import { AuthentificationService } from 'src/app/services/authentification/authentification.service';
import { GroupService } from 'src/app/services/group/group.service';
import { SessionService } from 'src/app/services/session/session.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  public user!: User;

  public createdGroups: boolean = false;
  public createdSessions: boolean = false;
  public joinedGroups: boolean = false;
  public attendedSessions: boolean = false;
  
  constructor(private authentificationService: AuthentificationService,
    private userService: UserService,
    private groupService: GroupService,
    private sessionService: SessionService,
    private router: Router) {}

  ngOnInit() {
    this.userService.getIdByToken(this.authentificationService.getToken())
    .subscribe((response) => {
      this.userService.getUser(response.id)
      .subscribe((response) => {
        this.user = response.user;

        this.groupService.getCreatedGroups(this.user.id)
        .subscribe({
          next:(response) => 
          {
            this.createdGroups = true;
          },
          error:(error) => 
          {
            this.createdGroups = false;
          }
        });

        this.sessionService.getCreatedSessions(this.user.id)
        .subscribe({
          next:(response) => 
          {
            this.createdSessions = true;
          },
          error:(error) => 
          {
            this.createdSessions = false;
          }
        });

        this.groupService.getJoinedGroups(this.user.id)
        .subscribe({
          next:(response) => 
          {
            this.joinedGroups = true;
          },
          error:(error) => 
          {
            this.joinedGroups = false;
          }
        });

        this.sessionService.getAttendedSessions(this.user.id)
        .subscribe({
          next:(response) => 
          {
            this.attendedSessions = true;
          },
          error:(error) => 
          {
            this.attendedSessions = false;
          }
        });
      })
    });
  }

  getCreatedGroups() {
    this.router.navigate(['createdGroups']);
  }

  getCreatedSessions() {
    this.router.navigate(['createdSessions']);
  }

  getJoinedGroups() {
    this.router.navigate(['joinedGroups']);
  }

  getAttendedSessions() {
    this.router.navigate(['attendedSessions']);
  }

  home() {
    this.router.navigate(['home']);
  }

  logOut() {
    this.authentificationService.logOut();
  }
}
