import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateForm';
import { AuthentificationService } from 'src/app/services/authentification.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit{
  type: string = "password";
  isVisible: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  
  signupForm!: FormGroup;
  constructor(private formBuilder: FormBuilder, private authentification: AuthentificationService, private router: Router, private toast: NgToastService) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      role: ['participant', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  hideShowPassword() {
    this.isVisible = !this.isVisible;
    this.isVisible ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isVisible ? this.type = "text" : this.type = "password";
  }

  onSubmit() {
    if (this.signupForm.valid) 
    {
      console.log(this.signupForm.value.role);
      this.authentification.signup(this.signupForm.value)
      .subscribe({
        next:(response) => 
        {
          this.toast.success({ detail:"SUCCESS", summary: response.message, duration: 5000});
          this.router.navigate([''] );
          this.signupForm.reset();
        },
        error:(error) => 
        {
          this.toast.error({ detail:"ERROR", summary: error.error.message, duration: 5000});
        }
      })
    }
    else {
      ValidateForm.validateAllFormFields(this.signupForm);
      this.toast.error({ detail:"ERROR", summary: "The Form Is Invalid!", duration: 5000});
    }
  }
}
