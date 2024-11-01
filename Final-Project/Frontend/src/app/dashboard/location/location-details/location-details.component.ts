import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { GetLocation } from '../../../_models/Location/get-location';
import { LocationService } from '../../../_services/location.service';
@Component({
  selector: 'app-location-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './location-details.component.html',
  styleUrl: './location-details.component.css',
})
export class LocationDetailsComponent implements OnInit, OnDestroy {
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly locationService = inject(LocationService);
  locationId: number | null = null;
  location: GetLocation | null = null;
  private subscriptions: Subscription | null = null;

  ngOnDestroy(): void {
    if (this.subscriptions) this.subscriptions.unsubscribe();
  }
  ngOnInit(): void {
    this.subscriptions = this.activeRoute.params.subscribe({
      next: (params) => {
        this.locationId = +params['id'];
        this.locationService.getLocationById(this.locationId).subscribe({
          next: (res) => {
            this.location = res;
          },
          error: (err) => {
            console.log(err.status); // if 404 redirect to 404 page same for rest
          },
        });
      },
    });
  }
}
