import { Component, inject, Input } from '@angular/core';
import { FlightDetailsComponent } from '../../../main/flights/flight-details/flight-details.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FlightService } from '../../../_services/flight.service';
import { Subscription } from 'rxjs';
import { Flight } from '../../../_models/Flight/flight';

@Component({
  selector: 'app-flight-info',
  standalone: true,
  imports: [FlightDetailsComponent, RouterLink],
  templateUrl: './flight-info.component.html',
  styleUrl: './flight-info.component.css',
})
export class FlightInfoComponent {
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly flightsService = inject(FlightService);
  flightId: number | null = null;
  flight: Flight | null = null;
  private subscriptions: Subscription | null = null;

  ngOnDestroy(): void {
    if (this.subscriptions) this.subscriptions.unsubscribe();
  }
  ngOnInit(): void {
    this.subscriptions = this.activeRoute.params.subscribe({
      next: (params) => {
        this.flightId = +params['id'];
        this.flight = this.flightsService.oneWayTrips?.find(
          (f) => f.id == this.flightId
        )!;
      },
      error: (err) => {
        console.log(err.status); // if 404 redirect to 404 page same for rest
      },
    });
  }
}
