import { Component } from '@angular/core';
import { HeaderComponent } from '../../../core/header/header.component';
import { SearchFormComponent } from '../search-from/search-form.component';
import { NavbarComponent } from '../../../core/navbar/navbar.component';
import { FooterComponent } from '../../../core/footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [
    HeaderComponent,
    SearchFormComponent,
    NavbarComponent,
    FooterComponent,
    RouterOutlet,
  ],
  templateUrl: './hotels-home.component.html',
  styleUrl: './hotels-home.component.css',
})
export class HotelsHomeComponent {}
