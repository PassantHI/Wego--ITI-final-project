import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../core/navbar/navbar.component';
import { FooterComponent } from '../../../core/footer/footer.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    RouterOutlet,
    RouterLink,
    BsDropdownModule,
    RouterLinkActive,
    CommonModule,
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css',
})
export class UserDashboardComponent implements OnInit {
  userName!: string;
  toggleMenu: boolean = false;
  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const data: any = jwtDecode(token);
      this.userName = data['userName'];
    }
    return '';
  }
}
