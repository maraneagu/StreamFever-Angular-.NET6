import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateForm';
import { Group } from 'src/app/models/group.model';
import { GroupService } from 'src/app/services/group/group.service';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})

export class EditGroupComponent {
  public groupId!: number;
  public editGroupForm!: FormGroup;

  public nameModified = false; 
  public descriptionModified = false;

  constructor(private formBuilder: FormBuilder,
    private toast: NgToastService,
    private router: Router,
    private groupService: GroupService,
    private route: ActivatedRoute) 
    {
      this.editGroupForm = this.formBuilder.group({
        name: ['', Validators.required],
        description: [''],
      });
    }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.groupId = +params.get('groupId')!;

      this.groupService.getGroup(this.groupId).
      subscribe((response) => 
      {
          this.editGroupForm.get('name')!.setValue(response.group.name);
          this.editGroupForm.get('description')!.setValue(response.group.description);
      });
    });
  }

  onNameChange() {
    this.nameModified = true;
  }

  onDescriptionChange() {
    this.descriptionModified = true;
  }

  onSubmit() {
    if (this.editGroupForm.valid) 
    {
      const group = {
        id: this.groupId,
        name: this.editGroupForm.value.name,
        description: this.editGroupForm.value.description
      };

      this.groupService.editGroup(group)
      .subscribe({
        next:(response) => 
        {
          this.toast.success({ detail:"SUCCESS", summary: response.message, duration: 5000});
          this.router.navigate(['groups'] );
        },
        error:(error) => 
        {
          this.toast.error({ detail:"ERROR", summary: error.message, duration: 5000});
        }
      })
    }
    else 
    {
      ValidateForm.validateAllFormFields(this.editGroupForm);
      this.toast.error({ detail:"ERROR", summary: "The Form Is Invalid!", duration: 5000});
    }
  }
}
