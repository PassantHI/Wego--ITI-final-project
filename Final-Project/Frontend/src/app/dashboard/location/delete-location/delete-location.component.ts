import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocationService } from '../../../_services/location.service';
import { GetLocation } from '../../../_models/Location/get-location';
@Component({
  selector: 'app-delete-location',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './delete-location.component.html',
  styleUrl: './delete-location.component.css',
})
export class DeleteLocationComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly locationService = inject(LocationService);
  internalError: string | null = null;
  locationId: number | null = null;
  location: GetLocation | null = null;
  private subscriptions: Subscription | null = null;

  delete() {
    if (!this.locationId || !this.location) return;

    this.locationService.deleteLocation(this.locationId).subscribe({
      next: (_) => {
        this.router.navigateByUrl('/dashboard/locations?r=true');
      },
      error: (err) => {
        console.log(err.status);
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
        this.locationId = +params['id'];
        this.locationService.getLocationById(this.locationId).subscribe({
          next: (res) => {
            this.location = res;
          },
          error: (err) => {
            console.log(err.status); // if 404 redirect to 404 page same for rest
            this.router.navigateByUrl('/dashboard/locations');
          },
        });
      },
    });
  }
}
