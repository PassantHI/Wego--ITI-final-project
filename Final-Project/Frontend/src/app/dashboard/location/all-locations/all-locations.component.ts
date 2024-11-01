import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocationService } from '../../../_services/location.service';
import { GetLocation } from '../../../_models/Location/get-location';
@Component({
  selector: 'app-all-locations',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './all-locations.component.html',
  styleUrl: './all-locations.component.css',
})
export class AllLocationsComponent implements OnInit, OnDestroy {
  private readonly locationService = inject(LocationService);
  private readonly activeRoute: ActivatedRoute = inject(ActivatedRoute);
  private subscribtions: Subscription | null = null;
  pageSize: number = 10;
  pageIndex: number = 1;
  totalPages: number = 0;
  totalResult: number = 0;
  private allLocations: GetLocation[] = [];
  currentPageLocations: GetLocation[] = [];
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
    this.locationService.getLocations().subscribe({
      next: (res) => {
        this.totalResult = res.length;
        // this.totalPages = Math.ceil(res.total / this.pageSize);
        this.allLocations = res;
        this.totalResult = this.allLocations.length;
        this.totalPages = Math.ceil(this.allLocations.length / this.pageSize);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);

        this.getPageResult();
      },
    });
  }

  private getPageResult() {
    let start = (this.pageIndex - 1) * this.pageSize;
    let end = start + this.pageSize;
    this.currentPageLocations = this.allLocations.slice(start, end);
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
