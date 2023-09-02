import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { response } from 'express';
import { NgToastService } from 'ng-angular-popup';
import { Group } from 'src/app/models/group.model';
import { Post } from 'src/app/models/post.model';
import { AuthentificationService } from 'src/app/services/authentification/authentification.service';
import { GroupService } from 'src/app/services/group/group.service';
import { PostService } from 'src/app/services/post/post.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-read-posts',
  templateUrl: './read-posts.component.html',
  styleUrls: ['./read-posts.component.scss']
})

export class ReadPostsComponent implements OnInit {
  public name: string = "";
  public role!: string;
  public userId!: number;

  public groupId!: number;
  public group!: Group;
  public groupUsername!: string;
  public isGroupManager: boolean = false;

  public posts: Post[] = [];

  constructor(private authentificationService: AuthentificationService,
    private userService: UserService,
    private groupService: GroupService,
    private postService: PostService,
    private router: Router,
    private toast: NgToastService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.userService.getIdByToken(this.authentificationService.getToken())
    .subscribe((response) => {
      this.userId = response.id;
    })

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

    this.route.paramMap.subscribe(params => {
      this.groupId = +params.get('groupId')!;

      this.getPosts(this.groupId);

      this.groupService.getGroup(this.groupId).
      subscribe((response) => 
      {
        this.group = response.group;

        this.userService.getUsernameById(this.group.userId)
        .subscribe((response) => 
        {
          this.groupUsername = response.username;
        });

        this.groupManager(this.group.userId);
      });
    });
  }

  groupManager(groupUserId: number) {
    this.userService.getIdByToken(this.authentificationService.getToken())
    .subscribe((response) => {
      if (response.id === groupUserId)
        this.isGroupManager = true;
      else this.isGroupManager = false;
    })
  }

  getPosts(groupId: number) {
    this.postService.getPosts(groupId)
      .subscribe((response) => {
        this.posts = response; 

        this.posts.forEach((post) => {
          if (post.date) {
            const date = new Date(post.date);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');

            post.date = `${day}-${month}-${year} ${hours}:${minutes}`;
          }
        })
      });
  }

  createPost() {
    this.router.navigate(['createPost', this.groupId]);
  }

  edit(postId: number) {
    this.router.navigate(['editPost', postId]);
  }

  delete(postId: number) {
    this.postService.deletePost(postId)
    .subscribe({
      next:(response) => 
      {
        this.toast.success({ detail:"SUCCESS", summary: "Post Deleted Succesfully!", duration: 5000});
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
