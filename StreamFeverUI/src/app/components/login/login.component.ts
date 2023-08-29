import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateForm';
import { AuthentificationService } from 'src/app/services/authentification/authentification.service';
import { UserService } from 'src/app/services/user/user.service';

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

  constructor(private formBuilder: FormBuilder, 
    private authentificationService: AuthentificationService, 
    private toast: NgToastService,
    private router: Router,
    private userService: UserService) {}

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
      this.authentificationService.logIn(this.loginForm.value)
      .subscribe({
        next:(response) => 
        {
          this.authentificationService.setToken(response.token);
          
          const token = this.authentificationService.decodedToken();
          this.userService.setName(token.name);
          this.userService.setRole(token.role);

          this.toast.success({ detail:"SUCCESS", summary: response.message, duration: 5000}); 
          this.router.navigate(['home']);
          this.loginForm.reset();
        },
        error:(error) => 
        {
          this.toast.error({ detail:"ERROR", summary: error.error.message, duration: 5000});
        }
      })
    }
    else 
    {
      ValidateForm.validateAllFormFields(this.loginForm);
      this.toast.error({ detail:"ERROR", summary: "The Form Is Invalid!", duration: 5000});
    }
  }
}
