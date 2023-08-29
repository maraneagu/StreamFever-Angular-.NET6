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

  createGroup(groupBody : any) {
    const userToken : string = this.authentificationService.getToken();
    const httpOptions = {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    };

    return this.http.post<any>(`${this.baseUrl}create`, groupBody, httpOptions);
  }

  getGroups() {
    return this.http.get<any>(this.baseUrl);
  }
}
