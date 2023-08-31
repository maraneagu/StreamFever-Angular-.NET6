import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Group } from 'src/app/models/group.model';
import { AuthentificationService } from 'src/app/services/authentification/authentification.service';
import { GroupService } from 'src/app/services/group/group.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-read-groups',
  templateUrl: './read-groups.component.html',
  styleUrls: ['./read-groups.component.scss']
})

export class ReadGroupsComponent implements OnInit {
  public name: string = "";
  public role!: string;

  public groups: Group[] = [];
  public groupUsernames: Map<number, string> = new Map<number, string>();
  public groupJoin: boolean[] = [];

  constructor(private authentificationService: AuthentificationService,
    private userService: UserService,
    private groupService: GroupService,
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

    this.groupService.getGroups()
    .subscribe(response => {
      // GETTING THE GROUP
      this.groups = response;

      // GETTING THE USERNAME FOR THAT GROUP
      this.getUsernames();

      // CHECKING IF THE GROUPS COULD BE JOINED BY THE CURRENT USER
      this.couldJoin();
    });
  }

  getUsernames() {
    this.groupUsernames.clear();

    this.groups.forEach((group) => {
      this.userService.getUsernameById(group.userId)
      .subscribe((response) => 
      {
        const username = response.username;
        this.groupUsernames.set(group.userId, username);
      });
    });
  }

  couldJoin() {
    this.userService.getIdByToken(this.authentificationService.getToken())
    .subscribe((response) => {
      const userId = response.id;

      this.groups.forEach((group) => {
        const userGroup = {
          userId: userId,
          groupId: group.id
        };

        if (group.userId === userId || this.groupService.userInGroup(userGroup))
          this.groupJoin.push(false);
        else this.groupJoin.push(true);
      });      
    });
  }

  join(groupId: number) {
    this.userService.getIdByToken(this.authentificationService.getToken())
    .subscribe((response) => {
      const userId = response.id;

      const userGroup = {
        userId: userId,
        groupId: groupId
      };

      this.groupService.joinGroup(userGroup)
      .subscribe({
        next:(response) => 
        {
          this.toast.success({ detail:"SUCCESS", summary: response.message, duration: 5000}); 
        },
        error:(error) => 
        {
          this.toast.error({ detail:"ERROR", summary: error.message, duration: 5000});
        }
      })
    });
  }

  home() : void {
    this.router.navigate(['home']);
  }

  logOut() : void {
    this.authentificationService.logOut();
  }
}
