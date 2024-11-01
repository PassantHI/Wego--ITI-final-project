import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AirplaneService } from '../../../_services/airplane.service';
import { GetAirplane } from '../../../_models/airplane/get-airplane';
@Component({
  selector: 'app-airplane-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './airplane-details.component.html',
  styleUrl: './airplane-details.component.css',
})
export class AirplaneDetailsComponent implements OnInit, OnDestroy {
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly airplaneService = inject(AirplaneService);
  airplaneId: number | null = null;
  airplane: GetAirplane | null = null;
  private subscriptions: Subscription | null = null;

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
          },
        });
      },
    });
  }
}
