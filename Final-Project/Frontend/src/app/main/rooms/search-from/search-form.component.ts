import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Router,
  RouterLink,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { HeaderComponent } from '../../../core/header/header.component';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
    HeaderComponent,
    CarouselModule,
    RouterLink,
    FormsModule,
  ],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.css',
})
export class SearchFormComponent {
  country = signal<string>('');
  guest = signal<string>('');
  router = inject(Router);
  onSend() {
    this.router.navigate(['hotels/rooms/', this.country()], {
      queryParams: { roomType: this.guest() },
    });
  }

  changeGuestValue($event: Event) {
    const el = $event.target as HTMLInputElement;
    const value = el.value;
    if (value) this.guest.set(value);
  }
}
