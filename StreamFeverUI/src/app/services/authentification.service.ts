import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthentificationService {

  private baseUrl : string = "https://localhost:7211/api/User/"
  constructor(private http: HttpClient, private router: Router) { }

  signup(userBody : any) {
    return this.http.post<any>(`${this.baseUrl}signup`, userBody);
  }
  
  login(userBody : any) {
    return this.http.post<any>(`${this.baseUrl}login`, userBody);
  }

  signout() {
    localStorage.clear();
    this.router.navigate(['']);
  }

  setToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
