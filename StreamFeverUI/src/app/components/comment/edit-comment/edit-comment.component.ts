import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateForm';
import { Comment } from 'src/app/models/comment.model';
import { CommentService } from 'src/app/services/comment/comment.service';

@Component({
  selector: 'app-edit-comment',
  templateUrl: './edit-comment.component.html',
  styleUrls: ['./edit-comment.component.scss']
})

export class EditCommentComponent implements OnInit {
  comment!: Comment;
  commentId!: number;
  editCommentForm!: FormGroup;

  public contentModified = false;

  constructor(private formBuilder: FormBuilder,
    private toast: NgToastService,
    private route: ActivatedRoute,
    private commentService: CommentService,
    private router: Router) 
    {
      this.editCommentForm = this.formBuilder.group({
        content: ['', Validators.required],
      });
    }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.commentId = +params.get('commentId')!;

      this.commentService.getComment(this.commentId).
      subscribe((response) => 
      {
        this.comment = response.comment;
        this.editCommentForm.get('content')!.setValue(response.comment.content);      
      });
    });
  }

  onContentChange() {
    this.contentModified = true;
  }

  onSubmit() {
    if (this.editCommentForm.valid) 
    {
      const comment = {
        id: this.commentId,
        content: this.editCommentForm.value.content,
      };

      this.commentService.editComment(comment)
      .subscribe({
        next:(response) => 
        {
          this.toast.success({ detail:"SUCCESS", summary: response.message, duration: 5000});
          this.router.navigate(['posts', this.comment.postId] );
          this.editCommentForm.reset();
        },
        error:(error) => 
        {
          this.toast.error({ detail:"ERROR", summary: error.message, duration: 5000});
        }
      })
    }
    else 
    {
      ValidateForm.validateAllFormFields(this.editCommentForm);
      this.toast.error({ detail:"ERROR", summary: "The Form Is Invalid!", duration: 5000});
    }
  }
}
