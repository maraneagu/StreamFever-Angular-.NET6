import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateForm';
import { GroupService } from 'src/app/services/group/group.service';
import { PostService } from 'src/app/services/post/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})

export class CreatePostComponent {
  groupId!: number;
  userId!: number;
  createPostForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private toast: NgToastService,
    private router: Router,
    private route: ActivatedRoute,
    private groupService: GroupService,
    private postService: PostService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.groupId = +params.get('groupId')!;

      this.groupService.getGroup(this.groupId).
      subscribe((response) => 
      {
        this.userId = response.group.userId;
      });
    });

    this.createPostForm = this.formBuilder.group({
      description: ['', Validators.required]
    })
  }

  onSubmit() {
    if (this.createPostForm.valid) 
    {
      const post = {
        description: this.createPostForm.value.description,
        userId: this.userId,
        groupId: this.groupId
      };

      this.postService.createPost(post)
      .subscribe({
        next:(response) => 
        {
          this.toast.success({ detail:"SUCCESS", summary: response.message, duration: 5000});
          this.router.navigate(['posts', this.groupId] );
          this.createPostForm.reset();
        },
        error:(error) => 
        {
          this.toast.error({ detail:"ERROR", summary: error.message, duration: 5000});
        }
      })
    }
    else 
    {
      ValidateForm.validateAllFormFields(this.createPostForm);
      this.toast.error({ detail:"ERROR", summary: "The Form Is Invalid!", duration: 5000});
    }
  }
}
