import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GetAirport } from '../../../_models/Airport/get-airport';
import { AirportService } from '../../../_services/airport.service';

@Component({
  selector: 'app-airport-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './airport-details.component.html',
  styleUrl: './airport-details.component.css',
})
export class AirportDetailsComponent implements OnInit, OnDestroy {
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly airportService = inject(AirportService);
  airportId: number | null = null;
  airport: GetAirport | null = null;
  private subscriptions: Subscription | null = null;

  ngOnDestroy(): void {
    if (this.subscriptions) this.subscriptions.unsubscribe();
  }
  ngOnInit(): void {
    this.subscriptions = this.activeRoute.params.subscribe({
      next: (params) => {
        this.airportId = +params['id'];
        this.airportService.getAirportById(this.airportId).subscribe({
          next: (res) => {
            this.airport = res;
          },
          error: (err) => {
            console.log(err.status); // if 404 redirect to 404 page same for rest
          },
        });
      },
    });
  }
}
