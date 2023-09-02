import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateForm';
import { Group } from 'src/app/models/group.model';
import { Post } from 'src/app/models/post.model';
import { Comment } from 'src/app/models/comment.model';
import { AuthentificationService } from 'src/app/services/authentification/authentification.service';
import { CommentService } from 'src/app/services/comment/comment.service';
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
  createCommentForm!: FormGroup;
  public commentUsernames: Map<number, string> = new Map<number, string>();
  public comments: Map<number, Comment[]> = new Map<number, Comment[]>();

  constructor(private authentificationService: AuthentificationService,
    private userService: UserService,
    private groupService: GroupService,
    private postService: PostService,
    private commentService: CommentService,
    private router: Router,
    private toast: NgToastService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) {}

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

    this.createCommentForm = this.formBuilder.group({
      content: ['', Validators.required]
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

        this.getComments(post.id);
      })
    });
  }

  createPost() {
    this.router.navigate(['createPost', this.groupId]);
  }

  editPost(postId: number) {
    this.router.navigate(['editPost', postId]);
  }

  deletePost(postId: number) {
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

  getComments(postId: number) {
    this.commentService.getComments(postId)
    .subscribe((response) => {
      this.comments.set(postId, response);

      this.comments.get(postId)?.forEach((comment) => {
        if (comment.date) {
          const date = new Date(comment.date);
          const day = date.getDate().toString().padStart(2, '0');
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const year = date.getFullYear();
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');

          comment.date = `${day}-${month}-${year} ${hours}:${minutes}`;
        }
      });

      this.getUsernames(postId);
    })
  }

  getUsernames(postId: number) {
    this.commentUsernames.clear();

    this.comments.get(postId)?.forEach((comment) => {
      this.userService.getUsernameById(comment.userId)
      .subscribe((response) => 
      {
        const username = response.username;
        this.commentUsernames.set(comment.id, username);
      });
    });
  }

  createComment(postId: number) {
    if (this.createCommentForm.valid) 
    {
      const comment = {
        content: this.createCommentForm.value.content,
        userId: this.userId,
        postId: postId
      };

      this.commentService.createComment(comment)
      .subscribe({
        next:(response) => 
        {
          this.toast.success({ detail:"SUCCESS", summary: response.message, duration: 5000});
          this.createCommentForm.reset();
          window.location.reload(); 
        },
        error:(error) => 
        {
          this.toast.error({ detail:"ERROR", summary: error.message, duration: 5000});
        }
      })
    }
    else 
    {
      ValidateForm.validateAllFormFields(this.createCommentForm);
      this.toast.error({ detail:"ERROR", summary: "The Form Is Invalid!", duration: 5000});
    }
  }

  editComment(commentId: number) {
    this.router.navigate(['editComment', commentId]);
  }

  deleteComment(commentId: number) {
    this.commentService.deleteComment(commentId)
    .subscribe({
      next:(response) => 
      {
        this.toast.success({ detail:"SUCCESS", summary: "Comment Deleted Succesfully!", duration: 5000});
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
