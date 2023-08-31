import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthentificationService } from '../authentification/authentification.service';
import { UserGroup } from 'src/app/models/user-group.model';

@Injectable({
  providedIn: 'root'
})

export class GroupService {
  private baseUrl : string = "https://localhost:7211/api/Group/";

  constructor(private http: HttpClient,
    private authentificationService : AuthentificationService) {}

  createGroup(groupBody: any) {
    const userToken : string = this.authentificationService.getToken();
    const httpOptions = {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    };

    return this.http.post<any>(`${this.baseUrl}create`, groupBody, httpOptions);
  }

  joinGroup(userGroupBody: any) {
    return this.http.post<any>(`${this.baseUrl}join`, userGroupBody);
  }

  userInGroup(userGroupBody: any){
    return this.http.get<any>(`${this.baseUrl}userInGroup`, userGroupBody);
  }

  getGroups() {
    return this.http.get<any>(this.baseUrl);
  }
}
