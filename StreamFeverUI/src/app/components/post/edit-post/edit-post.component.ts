import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateForm';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post/post.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss']
})

export class EditPostComponent implements OnInit {
  post!: Post;
  postId!: number;
  editPostForm!: FormGroup;

  public descriptionModified = false;

  constructor(private formBuilder: FormBuilder,
    private toast: NgToastService,
    private route: ActivatedRoute,
    private postService: PostService,
    private router: Router) 
    {
      this.editPostForm = this.formBuilder.group({
        description: ['', Validators.required],
      });
    }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.postId = +params.get('postId')!;

      this.postService.getPost(this.postId).
      subscribe((response) => 
      {
        this.post = response.post;
        this.editPostForm.get('description')!.setValue(response.post.description);      
      });
    });
  }

  onDescriptionChange() {
    this.descriptionModified = true;
  }

  onSubmit() {
    if (this.editPostForm.valid) 
    {
      const post = {
        id: this.postId,
        description: this.editPostForm.value.description,
      };

      this.postService.editPost(post)
      .subscribe({
        next:(response) => 
        {
          this.toast.success({ detail:"SUCCESS", summary: response.message, duration: 5000});
          this.router.navigate(['posts', this.post.groupId] );
          this.editPostForm.reset();
        },
        error:(error) => 
        {
          this.toast.error({ detail:"ERROR", summary: error.message, duration: 5000});
        }
      })
    }
    else 
    {
      ValidateForm.validateAllFormFields(this.editPostForm);
      this.toast.error({ detail:"ERROR", summary: "The Form Is Invalid!", duration: 5000});
    }
  }
}
