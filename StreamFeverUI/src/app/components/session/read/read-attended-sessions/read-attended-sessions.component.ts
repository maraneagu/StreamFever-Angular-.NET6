import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  public sessionUserId!: number;
  public sessions: Session[] = [];
  public sessionUsernames: Map<number, string> = new Map<number, string>();
  public sessionAttend: Map<number, boolean> = new Map<number, boolean>();
  public sessionEditDelete: Map<number, boolean> = new Map<number, boolean>();

  constructor(private authentificationService: AuthentificationService,
    private userService: UserService,
    private sessionService: SessionService,
    private router: Router,
    private toast: NgToastService,
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
      this.sessionUserId = +params.get('userId')!;

      this.sessionService.getAttendedSessions(this.sessionUserId)
      .subscribe({
        next:(response) => {
          // GETTING THE SESSIONS
          this.sessions = response;

          // GETTING THE USERNAME FOR THE SESSIONS
          this.getUsernames();

          // CHECKING IF THE SESSIONS COULD BE ATTENDED BY THE CURRENT USER
          this.couldAttend();

          // CHECKING IF THE SESSIONS COULD BE EDITED BY THE CURRENT USER
          this.couldEditDelete();
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

  couldAttend() {
    this.sessionAttend.clear();

    this.userService.getIdByToken(this.authentificationService.getToken())
    .subscribe((response) => {
      this.sessions.forEach((session) => {
        const userSession = {
          userId: response.id,
          sessionId: session.id
        };
  
        this.sessionService.userInSession(userSession).
        subscribe((response) => {
          console.log(response);
          if (session.userId === userSession.userId || response)
            this.sessionAttend.set(session.id, false);
          else this.sessionAttend.set(session.id, true);
        });
      });
    })      
  }

  attend(sessionId: number) {
    const userSession = {
      userId: this.userId,
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

  couldEditDelete() {
    this.sessionEditDelete.clear();

    this.userService.getIdByToken(this.authentificationService.getToken())
    .subscribe((response) => {
      this.sessions.forEach((session) => {
        if (session.userId === response.id)
          this.sessionEditDelete.set(session.id, true);
        else this.sessionEditDelete.set(session.id, false);
      }); 
    })     
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

  profile(userId: number) : void {
    this.router.navigate(['profile', userId]);
  }

  logOut() : void {
    this.authentificationService.logOut();
  }
}
