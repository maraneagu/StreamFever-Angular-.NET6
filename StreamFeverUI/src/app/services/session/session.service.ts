import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthentificationService } from '../authentification/authentification.service';

@Injectable({
  providedIn: 'root'
})

export class SessionService {
  private baseUrl : string = "https://localhost:7211/api/Session/";

  constructor(private http: HttpClient,
    private authentificationService : AuthentificationService) {}

  createSession(sessionBody : any) {
    const userToken : string = this.authentificationService.getToken();
    const httpOptions = {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    };

    return this.http.post<any>(`${this.baseUrl}create`, sessionBody, httpOptions);
  }

  editSession(sessionBody: any) {
    return this.http.put<any>(`${this.baseUrl}edit`, sessionBody);
  }

  deleteSession(sessionId: any) {
    return this.http.delete(`${this.baseUrl}delete?id=${sessionId}`);
  }

  attendSession(userSessionBody: any) {
    return this.http.post<any>(`${this.baseUrl}attend`, userSessionBody);
  }

  userInSession(userSessionBody: any) {
    return this.http.post<any>(`${this.baseUrl}user`, userSessionBody);
  }

  getSession(sessionId: number){
    return this.http.get<any>(`${this.baseUrl}${sessionId}`);
  }

  getSessions() {
    return this.http.get<any>(this.baseUrl);
  }
}
