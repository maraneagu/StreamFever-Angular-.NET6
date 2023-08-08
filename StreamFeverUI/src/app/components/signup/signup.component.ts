import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
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
  constructor(private formBuilder: FormBuilder, private authentification: AuthentificationService, private router: Router) {}

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
      console.log(this.signupForm.value);
      this.authentification.signup(this.signupForm.value)
      .subscribe({
        next:(response) => 
        {
          alert(response.message)
          this.signupForm.reset();
          this.router.navigate([''] );
        },
        error:(error) => 
        {
          alert(error.error.message)
        }
      })
    }
    else {
      ValidateForm.validateAllFormFields(this.signupForm);
      alert("Form Invalid!");
    }
  }
}
