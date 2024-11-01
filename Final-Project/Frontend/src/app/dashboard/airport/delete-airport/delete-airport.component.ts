import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GetAirport } from '../../../_models/Airport/get-airport';
import { AirportService } from '../../../_services/airport.service';

@Component({
  selector: 'app-delete-airport',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './delete-airport.component.html',
  styleUrl: './delete-airport.component.css',
})
export class DeleteAirportComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly airportService = inject(AirportService);
  internalError: string | null = null;
  airportId: number | null = null;
  airport: GetAirport | null = null;
  private subscriptions: Subscription | null = null;

  delete() {
    if (!this.airportId || !this.airport) return;
    if (this.airport.terminals.length > 0) {
      this.internalError =
        'Airport Terminals have to be deleted before deleting airport';
      return;
    }
    this.airportService.deleteAirport(this.airportId).subscribe({
      next: (_) => {
        this.router.navigateByUrl('/dashboard/airports?r=true');
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
        this.airportId = +params['id'];
        this.airportService.getAirportById(this.airportId).subscribe({
          next: (res) => {
            this.airport = res;
          },
          error: (err) => {
            console.log(err.status); // if 404 redirect to 404 page same for rest
            this.router.navigateByUrl('/dashboard/airports');
          },
        });
      },
    });
  }
}
