import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { FlightService } from '../../../_services/flight.service';
import { CommonModule } from '@angular/common';
import { Flight } from '../../../_models/Flight/flight';

@Component({
  selector: 'app-all-flights',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule],
  templateUrl: './all-flights.component.html',
  styleUrl: './all-flights.component.css',
})
export class AllFlightsComponent implements OnInit, OnDestroy {
  public readonly flightService = inject(FlightService);
  private readonly activeRoute: ActivatedRoute = inject(ActivatedRoute);
  private subscribtions: Subscription | null = null;
  pageSize: number = 10;
  pageIndex: number = 1;
  totalPages: number = 0;
  totalResult: number = 0;
  private flights: Flight[] = [];
  currentPageFlights: Flight[] = [];
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
    this.flightService.getAll().subscribe({
      next: (res) => {
        this.totalResult = res.length;
        // this.totalPages = Math.ceil(res.total / this.pageSize);
        this.flights = res;
        this.totalResult = this.flights.length;
        this.flightService.oneWayTrips = res;
        this.totalPages = Math.ceil(this.flights.length / this.pageSize);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

        this.getPageResult();
      },
    });
  }

  private getPageResult() {
    let start = (this.pageIndex - 1) * this.pageSize;
    let end = start + this.pageSize;
    this.currentPageFlights = this.flights.slice(start, end);
  }

  ngOnDestroy(): void {
    this.subscribtions?.unsubscribe();
  }

  changePage(event: Event) {
    const target: HTMLSelectElement = event.target as HTMLSelectElement;
    const value: number = +target.value;
    if (!value || value > this.totalPages) return;
    this.pageIndex = value;
    this.getPageResult();
  }
  previous() {
    if (this.pageIndex <= 1) return;
    --this.pageIndex;
    this.getPageResult();
  }
  next() {
    if (this.pageIndex >= this.totalPages) return;
    ++this.pageIndex;
    this.getPageResult();
  }
}
