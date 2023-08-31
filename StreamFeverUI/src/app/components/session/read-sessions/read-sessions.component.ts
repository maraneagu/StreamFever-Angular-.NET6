import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Session } from 'src/app/models/session.model';
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

  public sessions: Session[] = [];
  public sessionUsernames: Map<number, string> = new Map<number, string>();
  public sessionAttend: Map<number, boolean> = new Map<number, boolean>();
  public sessionEditDelete: Map<number, boolean> = new Map<number, boolean>();

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

    this.sessionService.getSessions()
    .subscribe(response => {
      // GETTING THE SESSIONS
      this.sessions = response;

      // GETTING THE USERNAME FOR THE SESSIONS
      this.getUsernames();

      // CHECKING IF THE SESSIONS COULD BE ATTENDED BY THE CURRENT USER
      this.couldAttend();

      // CHECKING IF THE SESSIONS COULD BE EDITED BY THE CURRENT USER
      this.couldEditDelete();
    });
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

  couldAttend() {
    this.sessionAttend.clear();

    this.userService.getIdByToken(this.authentificationService.getToken())
    .subscribe((response) => {
      const userId = response.id;

      this.sessions.forEach((session) => {
        const userSession = {
          userId: userId,
          sessionId: session.id
        };

        this.sessionService.userInSession(userSession).
        subscribe((response) => {
          console.log(response);
          if (session.userId === userId || response)
            this.sessionAttend.set(session.id, false);
          else this.sessionAttend.set(session.id, true);
        });
      });      
    });
  }

  attend(sessionId: number) {
    this.userService.getIdByToken(this.authentificationService.getToken())
    .subscribe((response) => {
      const userId = response.id;

      const userSession = {
        userId: userId,
        sessionId: sessionId
      };

      this.sessionService.attendSession(userSession)
      .subscribe({
        next:(response) => 
        {
          this.toast.success({ detail:"SUCCESS", summary: response.message, duration: 5000});
          window.location.reload(); 
        },
        error:(error) => 
        {
          this.toast.error({ detail:"ERROR", summary: error.message, duration: 5000});
        }
      })
    });
  }

  couldEditDelete() {
    this.sessionEditDelete.clear();

    this.userService.getIdByToken(this.authentificationService.getToken())
    .subscribe((response) => {
      const userId = response.id;

      this.sessions.forEach((session) => {
        if (session.userId === userId)
          this.sessionEditDelete.set(session.id, true);
        else this.sessionEditDelete.set(session.id, false);
      });      
    });
  }

  edit(sessionId: number) {
    this.router.navigate(['editSession', sessionId]);
  }

  delete(sessionId: number) {
    this.sessionService.deleteSession(sessionId)
    .subscribe({
      next:(response) => 
      {
        this.toast.success({ detail:"SUCCESS", summary: "Session Deleted Succesfully!", duration: 5000});
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

  logOut() : void {
    this.authentificationService.logOut();
  }
}
