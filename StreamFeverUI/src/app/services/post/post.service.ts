import { Injectable } from '@angular/core';
import { AuthentificationService } from '../authentification/authentification.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class PostService {
  private baseUrl : string = "https://localhost:7211/api/Post/";

  constructor(private http: HttpClient,
    private authentificationService : AuthentificationService) {}

  createPost(postBody: any) {
    return this.http.post<any>(`${this.baseUrl}create`, postBody);
  }

  editPost(postBody: any) {
    return this.http.put<any>(`${this.baseUrl}edit`, postBody);
  }

  deletePost(postId: any) {
    return this.http.delete(`${this.baseUrl}delete?id=${postId}`);
  }

  getPost(postId: number) {
    return this.http.get<any>(`${this.baseUrl}${postId}`);
  }

  getPosts(groupId: number) {
    return this.http.get<any>(`${this.baseUrl}group/${groupId}`);
  }
}
