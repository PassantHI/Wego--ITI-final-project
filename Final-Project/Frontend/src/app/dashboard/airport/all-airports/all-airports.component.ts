import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GetAirport } from '../../../_models/Airport/get-airport';
import { AirportService } from '../../../_services/airport.service';

@Component({
  selector: 'app-all-airports',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './all-airports.component.html',
  styleUrl: './all-airports.component.css',
})
export class AllAirportsComponent implements OnInit, OnDestroy {
  private readonly airportSercie = inject(AirportService);
  private readonly activeRoute: ActivatedRoute = inject(ActivatedRoute);
  private subscribtions: Subscription | null = null;
  pageSize: number = 10;
  pageIndex: number = 1;
  totalPages: number = 0;
  totalResult: number = 0;
  airports: GetAirport[] = [];
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
    this.airportSercie.getAirports(this.pageIndex, this.pageSize).subscribe({
      next: (res) => {
        this.totalResult = res.total;
        this.totalPages = Math.ceil(res.total / this.pageSize);
        this.airports = res.data;
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
