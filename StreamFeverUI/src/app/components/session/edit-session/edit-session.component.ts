import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateForm';
import { SessionService } from 'src/app/services/session/session.service';

@Component({
  selector: 'app-edit-session',
  templateUrl: './edit-session.component.html',
  styleUrls: ['./edit-session.component.scss']
})
export class EditSessionComponent {
  public sessionId!: number;
  public editSessionForm!: FormGroup;

  public titleModified = false; 
  public descriptionModified = false;
  public dateModified = false;
  public timeModified = false;

  constructor(private formBuilder: FormBuilder,
    private toast: NgToastService,
    private router: Router,
    private sessionService: SessionService,
    private route: ActivatedRoute) 
    {
      this.editSessionForm = this.formBuilder.group({
        title: ['', Validators.required],
        description: [''],
        date: ['', Validators.required],
        time: ['', Validators.required]
      });
    }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.sessionId = +params.get('sessionId')!;

      this.sessionService.getSession(this.sessionId).
      subscribe((response) => 
      {
          this.editSessionForm.get('title')!.setValue(response.session.title);
          this.editSessionForm.get('description')!.setValue(response.session.description);
          this.editSessionForm.get('date')!.setValue(response.session.date);
          this.editSessionForm.get('time')!.setValue(response.session.time);
      });
    });
  }

  onTitleChange() {
    this.titleModified = true;
  }

  onDescriptionChange() {
    this.descriptionModified = true;
  }

  onDateChange() {
    this.dateModified = true;
  }

  onTimeChange() {
    this.timeModified = true;
  }

  onSubmit() {
    if (this.editSessionForm.valid) 
    {
      const session = {
        id: this.sessionId,
        title: this.editSessionForm.value.title,
        description: this.editSessionForm.value.description,
        date: this.editSessionForm.value.date,
        time: this.editSessionForm.value.time
      };

      this.sessionService.editSession(session)
      .subscribe({
        next:(response) => 
        {
          this.toast.success({ detail:"SUCCESS", summary: response.message, duration: 5000});
          this.router.navigate(['sessions'] );
        },
        error:(error) => 
        {
          this.toast.error({ detail:"ERROR", summary: error.message, duration: 5000});
        }
      })
    }
    else 
    {
      ValidateForm.validateAllFormFields(this.editSessionForm);
      this.toast.error({ detail:"ERROR", summary: "The Form Is Invalid!", duration: 5000});
    }
  }
}
