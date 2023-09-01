import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthentificationService } from '../authentification/authentification.service';

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

  getCreatedGroups(userId: any) {
    return this.http.get<any>(`${this.baseUrl}${userId}/created`);
  }

  editGroup(groupBody: any) {
    return this.http.put<any>(`${this.baseUrl}edit`, groupBody);
  }

  deleteGroup(groupId: any) {
    return this.http.delete(`${this.baseUrl}delete?id=${groupId}`);
  }

  joinGroup(userGroupBody: any) {
    return this.http.post<any>(`${this.baseUrl}join`, userGroupBody);
  }

  getJoinedGroups(userId: any) {
    return this.http.get<any>(`${this.baseUrl}${userId}/joined`);
  }

  userInGroup(userGroupBody: any) {
    return this.http.post<any>(`${this.baseUrl}user`, userGroupBody);
  }

  getGroup(groupId: number){
    return this.http.get<any>(`${this.baseUrl}${groupId}`);
  }

  getGroups() {
    return this.http.get<any>(this.baseUrl);
  }
}
