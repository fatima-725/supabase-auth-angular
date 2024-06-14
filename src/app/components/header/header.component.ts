import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupaService } from '../../service/supa.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  constructor(private router: Router, private supaservice: SupaService) {}

  async logout() {
    await this.supaservice.signOutUser();
    this.router.navigate(['login']);
  }
}
