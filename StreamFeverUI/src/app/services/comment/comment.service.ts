import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl : string = "https://localhost:7211/api/Comment/";

  constructor(private http: HttpClient) {}

  createComment(commentBody: any) {
    return this.http.post<any>(`${this.baseUrl}create`, commentBody);
  }

  editComment(commentBody: any) {
    return this.http.put<any>(`${this.baseUrl}edit`, commentBody);
  }

  deleteComment(commentId: any) {
    return this.http.delete(`${this.baseUrl}delete?id=${commentId}`);
  }

  getComment(commentId: number) {
    return this.http.get<any>(`${this.baseUrl}${commentId}`);
  }

  getComments(postId: number) {
    return this.http.get<any>(`${this.baseUrl}post/${postId}`);
  }
}
