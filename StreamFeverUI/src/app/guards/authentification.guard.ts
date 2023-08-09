import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { NgToastService } from 'ng-angular-popup';
import { inject } from '@angular/core';

export const authentificationGuard: CanActivateFn = (route, state) => {
  const authentification = inject(AuthentificationService);
  const router = inject(Router);
  const toast = inject(NgToastService);

  if (authentification.isLoggedIn())
  {
    return true;
  }
  else 
  {
    router.navigate(['']);
    toast.error({ detail:"ERROR", summary: "Please Login First!", duration: 5000});
    return false;
  }
};
