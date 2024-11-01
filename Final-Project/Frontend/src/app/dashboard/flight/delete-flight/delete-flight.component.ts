import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { retry, Subscription } from 'rxjs';
import { FlightService } from '../../../_services/flight.service';
import { PutFlight } from '../../../_models/Flight/put-flight';
@Component({
  selector: 'app-delete-flight',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './delete-flight.component.html',
  styleUrl: './delete-flight.component.css',
})
export class DeleteFlightComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly flighttService = inject(FlightService);
  internalError: string | null = null;
  flightId: number | null = null;
  flight: PutFlight | null = null;
  private subscriptions: Subscription | null = null;

  delete() {
    if (!this.flightId || !this.flight) return;
    if (this.flight.noOfBookings! > 0) {
      this.internalError =
        'There is Booking Assocciated to this flight so it Can not be deleted';
      return;
    }

    this.flighttService.deleteFlight(this.flightId).subscribe({
      next: (_) => {
        this.router.navigateByUrl('/dashboard/flights?r=true');
      },
      error: (err) => {
        console.log(err.status);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptions) this.subscriptions.unsubscribe();
  }
  ngOnInit(): void {
    this.subscriptions = this.activeRoute.params.subscribe({
      next: (params) => {
        this.flightId = +params['id'];
        this.flighttService.getFlight(this.flightId).subscribe({
          next: (res) => {
            this.flight = res;
          },
          error: (err) => {
            console.log(err.status); // if 404 redirect to 404 page same for rest
            this.router.navigateByUrl('/dashboard/flights');
          },
        });
      },
    });
  }
}
