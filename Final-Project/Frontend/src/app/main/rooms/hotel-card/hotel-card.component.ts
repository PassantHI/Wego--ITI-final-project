import { Component, input } from '@angular/core';
import { Rooms } from '../../../_models/Rooms';
import { RouterLink } from '@angular/router';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-hotel-card',
  standalone: true,
  imports: [RouterLink, CarouselModule, CurrencyPipe],
  templateUrl: './hotel-card.component.html',
  styleUrl: './hotel-card.component.css',
})
export class HotelCardComponent {
  room = input.required<Rooms>();
}
