import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  public name!: string;
  public role!: string;
  public userId!: number;

  public profileUserId!: number;
  public user!: User;

  public createdGroups: boolean = false;
  public createdSessions: boolean = false;
  public joinedGroups: boolean = false;
  public attendedSessions: boolean = false;
  
  constructor(private authentificationService: AuthentificationService,
    private userService: UserService,
    private groupService: GroupService,
    private sessionService: SessionService,
    private router: Router,
    private route: ActivatedRoute) {}

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
    });

    this.userService.getIdByToken(this.authentificationService.getToken())
    .subscribe((response) => {
      this.userId = response.id;
    })

    this.route.paramMap.subscribe(params => {
      this.profileUserId = +params.get('userId')!;

      this.userService.getUser(this.profileUserId)
      .subscribe((response) => {
        this.user = response.user;
        console.log(this.user.id);

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
    })
  }

  getCreatedGroups() {
    this.router.navigate(['createdGroups', this.profileUserId]);
  }

  getCreatedSessions() {
    this.router.navigate(['createdSessions', this.profileUserId]);
  }

  getJoinedGroups() {
    this.router.navigate(['joinedGroups', this.profileUserId]);
  }

  getAttendedSessions() {
    this.router.navigate(['attendedSessions', this.profileUserId]);
  }

  home() {
    this.router.navigate(['home']);
  }

  profile(userId: number) {
    this.router.navigate(['profile', userId]);
  }

  logOut() {
    this.authentificationService.logOut();
  }
}
