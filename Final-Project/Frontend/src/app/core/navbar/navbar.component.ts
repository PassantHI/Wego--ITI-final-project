import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
  Input,
  input,
  OnDestroy,
} from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Subscription } from 'rxjs';
import { AuthService } from '../../_services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    FontAwesomeModule,
    RouterModule,
    CommonModule,
    BsDropdownModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnDestroy {
  faCartDown = faCaretDown;
  isScrolled = false;
  isLogged: boolean = false;
  private subscription!: Subscription;
  private authService: AuthService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  currency!: string;
  language!: string;
  country!: string;
  navToggle: boolean = false;
  @Input({ required: false }) setWhite: boolean = false;

  ngOnInit() {
    this.subscription = this.authService.isLoggedIn$.subscribe(
      (status: boolean) => {
        this.isLogged = status;
        this.cdr.detectChanges();
      }
    );

    let currency = localStorage.getItem('currency');
    if (!currency) {
      currency = 'USD';
      localStorage.setItem('currency', currency);
    }
    this.currency = currency;

    let language = localStorage.getItem('language');
    if (!language) {
      language = 'English';
      localStorage.setItem('language', language);
    }
    this.language = language;

    let country = localStorage.getItem('country');
    if (!country) {
      country = 'Egypt';
      localStorage.setItem('country', country);
    }
    this.country = country;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollOffset = window.scrollY || 0;

    if (scrollOffset > 0) {
      this.isScrolled = true;
    } else {
      this.isScrolled = false;
    }
  }

  getUserName() {
    const token = localStorage.getItem('token');
    if (!token) return '';
    const data: any = jwtDecode(token);
    const userName: string = data['userName'];
    return userName;
  }

  getRole() {
    const token = localStorage.getItem('token');
    if (!token) return '';
    const data: any = jwtDecode(token);
    const role = data['role'];
    return role;
  }
}
