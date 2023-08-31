import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import ValidateForm from 'src/app/helpers/validateForm';
import { SessionService } from 'src/app/services/session/session.service';

@Component({
  selector: 'app-create-session',
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.scss']
})

export class CreateSessionComponent {
  createSessionForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private toast: NgToastService,
    private router: Router,
    private sessionService: SessionService) {}

  ngOnInit(): void {
    this.createSessionForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
      date: ['', Validators.required],
      time: ['', Validators.required],
    })
  }

  onSubmit() {
    if (this.createSessionForm.valid) 
    {
      this.sessionService.createSession(this.createSessionForm.value)
      .subscribe({
        next:(response) => 
        {
          this.toast.success({ detail:"SUCCESS", summary: response.message, duration: 5000});
          this.router.navigate(['home'] );
          this.createSessionForm.reset();
        },
        error:(error) => 
        {
          this.toast.error({ detail:"ERROR", summary: error.message, duration: 5000});
        }
      })
    }
    else 
    {
      ValidateForm.validateAllFormFields(this.createSessionForm);
      this.toast.error({ detail:"ERROR", summary: "The Form Is Invalid!", duration: 5000});
    }
  }
}
