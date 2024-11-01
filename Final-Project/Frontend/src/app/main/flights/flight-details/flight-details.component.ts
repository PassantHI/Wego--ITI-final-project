import { Component, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight } from '../../../_models/Flight/flight';
import { FlightService } from '../../../_services/flight.service';

@Component({
  selector: 'app-flight-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-details.component.html',
  styleUrl: './flight-details.component.css',
})
export class FlightDetailsComponent {
  @Input() flight: Flight | null = null;
  @Input() direction: string = '';
  constructor(public flightService: FlightService) {}

  ngOnInit() {}
}
