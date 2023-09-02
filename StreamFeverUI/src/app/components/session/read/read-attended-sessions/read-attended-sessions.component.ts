import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Session } from 'src/app/models/session.model';
import { AuthentificationService } from 'src/app/services/authentification/authentification.service';
import { SessionService } from 'src/app/services/session/session.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-read-attended-sessions',
  templateUrl: './read-attended-sessions.component.html',
  styleUrls: ['./read-attended-sessions.component.scss']
})
export class ReadAttendedSessionsComponent {
  public name: string = "";
  public role!: string;
  public userId!: number;

  public sessions: Session[] = [];
  public sessionUsernames: Map<number, string> = new Map<number, string>();

  constructor(private authentificationService: AuthentificationService,
    private userService: UserService,
    private sessionService: SessionService,
    private router: Router,
    private toast: NgToastService) {}

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

      this.sessionService.getAttendedSessions(response.id)
      .subscribe({
        next:(response) => {
          // GETTING THE SESSIONS
          this.sessions = response;

          // GETTING THE USERNAME FOR THE SESSIONS
          this.getUsernames();
        },
        error:(error) => 
        {
          this.router.navigate(['profile', this.userId]);
        }
      });
    })
  }

  getUsernames() {
    this.sessionUsernames.clear();

    this.sessions.forEach((session) => {
      this.userService.getUsernameById(session.userId)
      .subscribe((response) => 
      {
        const username = response.username;
        this.sessionUsernames.set(session.userId, username);
      });
    });
  }

  unattend(sessionId: number) {
    this.sessionService.unattendSession(this.userId, sessionId)
    .subscribe({
      next:(response) => 
      {
        this.toast.success({ detail:"SUCCESS", summary: "Session Unattended Succesfully!", duration: 5000});
        window.location.reload(); 
      },
      error:(error) => 
      {
        this.toast.error({ detail:"ERROR", summary: error.message, duration: 5000});
      }
    });
  }

  home() : void {
    this.router.navigate(['home']);
  }

  profile(userId: number) : void {
    this.router.navigate(['profile', userId]);
  }

  logOut() : void {
    this.authentificationService.logOut();
  }
}
