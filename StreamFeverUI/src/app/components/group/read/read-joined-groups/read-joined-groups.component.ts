import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Group } from 'src/app/models/group.model';
import { AuthentificationService } from 'src/app/services/authentification/authentification.service';
import { GroupService } from 'src/app/services/group/group.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-read-joined-groups',
  templateUrl: './read-joined-groups.component.html',
  styleUrls: ['./read-joined-groups.component.scss']
})
export class ReadJoinedGroupsComponent {
  public name: string = "";
  public role!: string;
  public userId!: number;

  public groups: Group[] = [];
  public groupUsernames: Map<number, string> = new Map<number, string>();

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
    });

    this.userService.getIdByToken(this.authentificationService.getToken())
    .subscribe((response) => {
      this.userId = response.id;

      this.groupService.getJoinedGroups(response.id)
      .subscribe(response => {
        // GETTING THE GROUPS
        this.groups = response;

        // GETTING THE USERNAME FOR THE GROUPS
        this.getUsernames();
      });
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

  posts(groupId: number) : void {
    this.router.navigate(['posts', groupId]);
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
