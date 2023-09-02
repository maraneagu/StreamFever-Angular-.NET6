import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthentificationService } from 'src/app/services/authentification/authentification.service';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authentification: AuthentificationService,
    private toast: NgToastService,
    private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authentification.getToken();
    if (token) {
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${token}`}
      })
    }

    return next.handle(request).pipe(
      catchError((error : any) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            this.toast.warning({detail:"WARNING", summary: "Your Session Has Expired! Please Login Again!"});
            this.router.navigate(['']);
          }
          else if (error.status === 400) {
            return throwError(() => new Error("Session In The Past!"));
          }
        }
        
        return throwError(() => new Error("Some Error Occured!"));
      })
    );
  }
}
