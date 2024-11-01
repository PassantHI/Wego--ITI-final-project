import { Component, inject } from '@angular/core';
import { AuthService } from '../../../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
})
export class LogoutComponent {
  private authServcie = inject(AuthService);
  private router = inject(Router);
  ngOnInit() {
    this.authServcie.logout();
    localStorage.removeItem('token');
    this.router.navigateByUrl('/home');
  }
}
