import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  public userId!: number;

  public groupUserId!: number;
  public groups: Group[] = [];
  public groupUsernames: Map<number, string> = new Map<number, string>();
  public groupJoin: Map<number, boolean> = new Map<number, boolean>();
  public groupEditDelete: Map<number, boolean> = new Map<number, boolean>();

  constructor(private authentificationService: AuthentificationService,
    private userService: UserService,
    private groupService: GroupService,
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
      this.groupUserId = +params.get('userId')!;

      this.groupService.getCreatedGroups(this.groupUserId)
      .subscribe(response => {
        // GETTING THE GROUPS
        this.groups = response;

        // GETTING THE USERNAME FOR THE GROUPS
        this.getUsernames();

        // CHECKING IF THE GROUPS COULD BE JOINED BY THE CURRENT USER
        this.couldJoin();

        // CHECKING IF THE GROUPS COULD BE EDITED BY THE CURRENT USER
        this.couldEditDelete();
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

  couldJoin() {
    this.groupJoin.clear();

    this.userService.getIdByToken(this.authentificationService.getToken())
    .subscribe((response) => {
      this.groups.forEach((group) => {
        const userGroup = {
          userId: response.id,
          groupId: group.id
        };
  
        this.groupService.userInGroup(userGroup).
        subscribe((response) => {
          if (group.userId === userGroup.userId || response)
            this.groupJoin.set(group.id, false);
          else this.groupJoin.set(group.id, true);
        });
      });
    })
  }

  join(groupId: number) {
    const userGroup = {
      userId: this.userId,
      groupId: groupId
    };

    this.groupService.joinGroup(userGroup)
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
    });
  }

  leave(groupId: number) {
    this.groupService.leaveGroup(this.userId, groupId)
    .subscribe({
      next:(response) => 
      {
        this.toast.success({ detail:"SUCCESS", summary: "Group Left Succesfully!", duration: 5000});
        window.location.reload(); 
      },
      error:(error) => 
      {
        this.toast.error({ detail:"ERROR", summary: error.message, duration: 5000});
      }
    });
  }

  couldEditDelete() {
    this.groupEditDelete.clear();

    this.userService.getIdByToken(this.authentificationService.getToken())
    .subscribe((response) => {
      this.groups.forEach((group) => {
        if (group.userId === response.id)
          this.groupEditDelete.set(group.id, true);
        else this.groupEditDelete.set(group.id, false);
      }); 
    })     
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

  profile(userId: number) : void {
    this.router.navigate(['profile', userId]);
  }

  logOut() : void {
    this.authentificationService.logOut();
  }
}
