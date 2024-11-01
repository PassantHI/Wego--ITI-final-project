import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { GetAirline } from '../../../_models/Airline/get-airline';
import { AirlineService } from '../../../_services/airline.service';

@Component({
  selector: 'app-delete-airline',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './delete-airline.component.html',
  styleUrl: './delete-airline.component.css',
})
export class DeleteAirlineComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly airlineService = inject(AirlineService);
  internalError: string | null = null;
  airlineId: number | null = null;
  airline: GetAirline | null = null;
  private subscriptions: Subscription | null = null;

  delete() {
    if (!this.airlineId || !this.airline) return;

    this.airlineService.deleteAirline(this.airlineId).subscribe({
      next: (_) => {
        this.router.navigateByUrl('/dashboard/airlines?r=true');
      },
      error: (err) => {
        this.internalError = err.message;
      },
    });
  }

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
            this.router.navigateByUrl('/dashboard/airlines');
          },
        });
      },
    });
  }
}
