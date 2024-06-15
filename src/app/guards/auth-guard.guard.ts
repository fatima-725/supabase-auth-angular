import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SupaService } from '../service/supa.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: SupaService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    if (await this.authService.isLoggedIn()) {
      return true;
    } else {
      window.location.replace('/login');
      return false;
    }
  }
}
