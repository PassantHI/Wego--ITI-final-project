import { Component, Input, input, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlightService } from '../../../_services/flight.service';
import { Flight } from '../../../_models/Flight/flight';

@Component({
  selector: 'app-flight-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-card.component.html',
  styleUrl: './flight-card.component.css',
})
export class FlightCardComponent {
  constructor(public flightService: FlightService) {}

  @Input() flight: Flight | null = null;
}
