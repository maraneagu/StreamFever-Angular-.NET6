import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Group } from 'src/app/models/group.model';
import { AuthentificationService } from 'src/app/services/authentification/authentification.service';
import { GroupService } from 'src/app/services/group/group.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-read-created-groups',
  templateUrl: './read-created-groups.component.html',
  styleUrls: ['./read-created-groups.component.scss']
})
export class ReadCreatedGroupsComponent {
  public name: string = "";
  public role!: string;

  public groups: Group[] = [];
  public groupUsernames: Map<number, string> = new Map<number, string>();

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

    this.userService.getIdByToken(this.authentificationService.getToken())
    .subscribe((response) => {
      this.groupService.getCreatedGroups(response.id)
      .subscribe(response => {
        // GETTING THE GROUPS
        this.groups = response;

        // GETTING THE USERNAME FOR THE GROUPS
        this.getUsernames();
      });
    })
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

  edit(groupId: number) {
    this.router.navigate(['editGroup', groupId]);
  }

  delete(groupId: number) {
    this.groupService.deleteGroup(groupId)
    .subscribe({
      next:(response) => 
      {
        this.toast.success({ detail:"SUCCESS", summary: "Group Deleted Succesfully!", duration: 5000});
        window.location.reload();
      },
      error:(error) => 
      {
        this.toast.error({ detail:"ERROR", summary: error.message, duration: 5000});
      }
    });
  }

  posts(groupId: number) : void {
    this.router.navigate(['posts', groupId]);
  }

  home() : void {
    this.router.navigate(['home']);
  }

  profile() : void {
    this.router.navigate(['profile']);
  }

  logOut() : void {
    this.authentificationService.logOut();
  }
}
