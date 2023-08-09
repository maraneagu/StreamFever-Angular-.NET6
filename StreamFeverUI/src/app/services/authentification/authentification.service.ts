import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthentificationService {

  private baseUrl : string = "https://localhost:7211/api/User/"
  constructor(private http: HttpClient, private router: Router) { }

  signUp(userBody : any) {
    return this.http.post<any>(`${this.baseUrl}signup`, userBody);
  }

  signOut() {
    localStorage.clear();
    this.router.navigate(['']);
  }
  
  logIn(userBody : any) {
    return this.http.post<any>(`${this.baseUrl}login`, userBody);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  setToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
