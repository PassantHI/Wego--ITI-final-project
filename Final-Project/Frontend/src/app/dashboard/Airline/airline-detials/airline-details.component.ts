import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AirlineService } from '../../../_services/airline.service';
import { GetAirline } from '../../../_models/Airline/get-airline';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-airline-detials',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './airline-details.component.html',
  styleUrl: './airline-details.component.css',
})
export class AirlineDetailsComponent implements OnInit, OnDestroy {
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly airlineService = inject(AirlineService);
  airlineId: number | null = null;
  airline: GetAirline | null = null;
  private subscriptions: Subscription | null = null;

  ngOnDestroy(): void {
    if (this.subscriptions) this.subscriptions.unsubscribe();
  }
  ngOnInit(): void {
    this.subscriptions = this.activeRoute.params.subscribe({
      next: (params) => {
        this.airlineId = +params['id'];
        this.airlineService.getAirlineById(this.airlineId).subscribe({
          next: (res) => {
            this.airline = res;
          },
          error: (err) => {
            console.log(err.status); // if 404 redirect to 404 page same for rest
          },
        });
      },
    });
  }
}
