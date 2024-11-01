import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { GetAirline } from '../../../_models/Airline/get-airline';
import { AirlineService } from '../../../_services/airline.service';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all-airlines',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './all-airlines.component.html',
  styleUrl: './all-airlines.component.css',
})
export class AllAirlinesComponent implements OnInit, OnDestroy {
  private readonly airlineService = inject(AirlineService);
  private readonly activeRoute: ActivatedRoute = inject(ActivatedRoute);
  private subscribtions: Subscription | null = null;
  pageSize: number = 10;
  pageIndex: number = 1;
  totalPages: number = 0;
  totalResult: number = 0;
  allAirlines: GetAirline[] = [];
  pages: number[] = [];

  ngOnInit(): void {
    this.fetchData();
    this.subscribtions = this.activeRoute.queryParams.subscribe({
      next: (qParams) => {
        const needToRefresh = qParams['r'];
        if (needToRefresh === 'true') this.fetchData();
      },
    });
  }

  private fetchData() {
    this.airlineService.getAirlines(this.pageIndex, this.pageSize).subscribe({
      next: (res) => {
        this.totalResult = res.total;
        this.totalPages = Math.ceil(res.total / this.pageSize);
        this.allAirlines = res.data;
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
    });
  }

  ngOnDestroy(): void {
    this.subscribtions?.unsubscribe();
  }

  changePage(event: Event) {
    const target: HTMLSelectElement = event.target as HTMLSelectElement;
    const value: number = +target.value;
    if (!value || value > this.totalPages) return;
    this.pageIndex = value;
    this.fetchData();
  }
  previous() {
    if (this.pageIndex <= 1) return;
    --this.pageIndex;
    this.fetchData();
  }
  next() {
    if (this.pageIndex >= this.totalPages) return;
    ++this.pageIndex;
    this.fetchData();
  }
}
