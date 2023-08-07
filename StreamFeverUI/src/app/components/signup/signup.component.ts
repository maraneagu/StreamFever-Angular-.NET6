import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidateForm from 'src/app/helpers/validateForm';

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
  constructor(private formBuilder: FormBuilder) {}

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
    if (this.signupForm.valid) {}
    else {
      ValidateForm.validateAllFormFields(this.signupForm);
      alert("Form Invalid!");
    }
  }
}
