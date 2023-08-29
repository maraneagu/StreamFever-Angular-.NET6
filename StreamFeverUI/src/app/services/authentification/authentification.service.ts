import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})

export class AuthentificationService {

  private baseUrl : string = "https://localhost:7211/api/User/"
  private user : any;

  constructor(private http: HttpClient, private router: Router) { 
    this.user = this.decodedToken();
  }

  signUp(userBody : any) {
    return this.http.post<any>(`${this.baseUrl}signup`, userBody);
  }
  
  logIn(userBody : any) {
    return this.http.post<any>(`${this.baseUrl}login`, userBody);
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken() : any {
    return localStorage.getItem('token');
  }

  setToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }

  decodedToken() {
    const jwtHelperService = new JwtHelperService();
    const token = this.getToken()!;
    return jwtHelperService.decodeToken(token);
  }

  getNameToken() {
    if (this.user)
      return this.user.name;
  }

  getRoleToken() {
    if (this.user)
      return this.user.role;
  }
}
