import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateForm';
import { GroupService } from 'src/app/services/group/group.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})

export class CreateGroupComponent implements OnInit {
  createGroupForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private toast: NgToastService,
    private router: Router,
    private groupService: GroupService) {}

  ngOnInit(): void {
    this.createGroupForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
    })
  }

  onSubmit() {
    if (this.createGroupForm.valid) 
    {
      console.log(this.createGroupForm.value);
      this.groupService.createGroup(this.createGroupForm.value)
      .subscribe({
        next:(response) => 
        {
          this.toast.success({ detail:"SUCCESS", summary: response.message, duration: 5000});
          this.router.navigate(['groups'] );
          this.createGroupForm.reset();
        },
        error:(error) => 
        {
          this.toast.error({ detail:"ERROR", summary: error.message, duration: 5000});
        }
      })
    }
    else 
    {
      ValidateForm.validateAllFormFields(this.createGroupForm);
      this.toast.error({ detail:"ERROR", summary: "The Form Is Invalid!", duration: 5000});
    }
  }
}
