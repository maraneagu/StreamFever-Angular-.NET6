import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})

export class AuthentificationService {

  private baseUrl : string = "https://localhost:7211/api/User/"
  constructor(private http: HttpClient) { }

  signup(userBody : any) {
    return this.http.post<any>(`${this.baseUrl}signup`, userBody);
  }
  
  login(userBody : any) {
    return this.http.post<any>(`${this.baseUrl}login`, userBody);
  }
}
