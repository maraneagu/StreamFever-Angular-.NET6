import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidateForm from 'src/app/helpers/validateForm';
import { AuthentificationService } from 'src/app/services/authentification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit{
  type: string = "password";
  isVisible: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  
  loginForm!: FormGroup;
  constructor(private formBuilder: FormBuilder, private authentification: AuthentificationService) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
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
    if (this.loginForm.valid) 
    {
      this.authentification.login(this.loginForm.value)
      .subscribe({
        next:(response) => 
        {
          alert(response.message)
          this.loginForm.reset();
        },
        error:(error) => 
        {
          alert(error.error.message)
        }
      })
    }
    else 
    {
      ValidateForm.validateAllFormFields(this.loginForm);
      alert("Form Invalid!");
    }
  }
}
