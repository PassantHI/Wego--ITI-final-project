import { Component } from '@angular/core';
import { NavbarComponent } from '../../../core/navbar/navbar.component';
import { FooterComponent } from '../../../core/footer/footer.component';
import { FilterSearchFromComponent } from './filter-search-from/filter-search-from.component';
import { FlightListComponent } from '../flight-list/flight-list.component';
import { FlightDetailViewerComponent } from '../flight-detail-viewer/flight-detail-viewer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-flights-filter',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NavbarComponent,
    FooterComponent,
    FilterSearchFromComponent,
    FlightListComponent,
    FlightDetailViewerComponent,
  ],
  templateUrl: './flights-filter.component.html',
  styleUrl: './flights-filter.component.css',
})
export class FlightsFilterComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}
  flights: any[] = [];
  airlines: string[] = [];
  SortType: string | null = null;
  minPrice: string | null = null;
  maxPrice: string | null = null;
  minDuration: string | null = null;
  maxDuration: string | null = null;
  flightTime: string | null = null;

  updateMinPrice(e: string) {
    this.minPrice = e;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { minPrice: this.minPrice },
      queryParamsHandling: 'merge',
    });
  }
  updateMaxPrice(e: string) {
    this.maxPrice = e;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { maxPrice: this.maxPrice },
      queryParamsHandling: 'merge',
    });
  }
  updateMinDuration(e: string) {
    this.minDuration = e;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { minDuration: this.minDuration },
      queryParamsHandling: 'merge',
    });
  }
  updateMaxDuration(e: string) {
    this.maxDuration = e;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { maxDuration: this.maxDuration },
      queryParamsHandling: 'merge',
    });
  }

  onSortButtonClick(sortType: string): void {
    this.SortType = sortType;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sortBy: sortType },
      queryParamsHandling: 'merge',
    });
  }
}
