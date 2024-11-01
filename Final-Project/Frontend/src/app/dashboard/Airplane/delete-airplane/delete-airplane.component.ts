import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AirplaneService } from '../../../_services/airplane.service';
import { GetAirplane } from '../../../_models/airplane/get-airplane';
@Component({
  selector: 'app-delete-airplane',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './delete-airplane.component.html',
  styleUrl: './delete-airplane.component.css',
})
export class DeleteAirplaneComponent implements OnDestroy, OnInit {
  private readonly router = inject(Router);
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly airplaneService = inject(AirplaneService);
  internalError: string | null = null;
  airplaneId: number | null = null;
  airplane: GetAirplane | null = null;
  private subscriptions: Subscription | null = null;

  delete() {
    if (!this.airplaneId || !this.airplane) return;
    if (this.airplane.totalFlights > 0) {
      this.internalError =
        'Airplanes that have any previous or upcoming flights can not be deleted';
      return;
    }
    this.airplaneService.deleteAirplane(this.airplaneId).subscribe({
      next: (_) => {
        this.router.navigateByUrl('/dashboard/airplanes?r=true');
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
        this.airplaneId = +params['id'];
        this.airplaneService.getAirplaneById(this.airplaneId).subscribe({
          next: (res) => {
            this.airplane = res;
          },
          error: (err) => {
            console.log(err.status); // if 404 redirect to 404 page same for rest
            this.router.navigateByUrl('/dashboard/airplanes');
          },
        });
      },
    });
  }
}
