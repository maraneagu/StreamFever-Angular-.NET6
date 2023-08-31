import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl : string = "https://localhost:7211/api/User/"

  private name = new BehaviorSubject<string>("");
  private role = new BehaviorSubject<string>("");
  
  constructor(private http: HttpClient) { }

  getName() {
    return this.name.asObservable();
  }

  setName(name : string) {
    this.name.next(name);
  }

  getRole() {
    return this.role.asObservable();
  }

  setRole(role : string) {
    this.role.next(role);
  }

  getUsernameById(userId: number) {
    return this.http.get<any>(`${this.baseUrl}${userId}/username`);
  }

  getIdByToken(token: string) {
    return this.http.get<any>(`${this.baseUrl}${token}/id`);
  }

  getUser(userId: number) {
    return this.http.get<any>(`${this.baseUrl}${userId}`);
  }

  getUsers() {
    return this.http.get<any>(`${this.baseUrl}`);
  }
}
