import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private name = new BehaviorSubject<string>("");
  private role = new BehaviorSubject<string>("");
  
  constructor() { }

  public getName() {
    return this.name.asObservable();
  }

  public setName(name : string) {
    this.name.next(name);
  }

  public getRole() {
    return this.role.asObservable();
  }

  public setRole(role : string) {
    this.role.next(role);
  }
}
