import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { Subscription } from 'rxjs';
import { FlightService } from '../../../_services/flight.service';
import { RoundTrip } from '../../../_models/Flight/round-trip';
import { Flight } from '../../../_models/Flight/flight';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightRequestParams } from '../../../_models/Flight/flight-request-params';

@Component({
  selector: 'app-flight-list',
  standalone: true,
  imports: [FlightCardComponent],
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.css'],
})
export class FlightListComponent implements OnInit, OnDestroy {
  constructor(public flightService: FlightService) {}

  flights: Flight[] | null = null;
  roundTrips: RoundTrip[] | null = [];
  isRoundTrip: boolean = true;
  error: boolean = false;
  private readonly activeRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  sub: Subscription | null = null;

  ngOnInit(): void {
    this.sub = this.activeRoute.queryParams.subscribe({
      next: (params) => {
        const departAirportId: number | undefined = params['departAirportId'];
        const arrivalAirportId: number | undefined = params['arrivalAirportId'];
        const seatClass: number | undefined = params['class'];
        const departDate: string | undefined = params['departDate'];
        const returnDate: string | undefined = params['returnDate'];
        const flightType: string | undefined = params['type'];
        const seats: number | undefined = params['seats'];

        if (
          !departAirportId ||
          !arrivalAirportId ||
          seatClass === undefined ||
          !(seatClass >= 0 && seatClass <= 2) ||
          !departDate ||
          !seats ||
          !flightType
        ) {
          this.error = true;
          return;
        }
        if (flightType == 'round' && !returnDate) {
          this.error = true;
          return;
        }

        this.isRoundTrip = this.flightService.isRoundTrip =
          flightType === 'round';

        if (this.isRoundTrip) {
          const reqParamas: FlightRequestParams = new FlightRequestParams(
            departAirportId,
            arrivalAirportId,
            departDate,
            seats,
            seatClass,
            returnDate
          );
          this.sub = this.flightService
            .getRoundTripList(reqParamas)
            .subscribe((f) => {
              this.roundTrips = f;
            });
        } else {
          const reqParamas: FlightRequestParams = new FlightRequestParams(
            departAirportId,
            arrivalAirportId,
            departDate,
            seats,
            seatClass
          );
          this.sub = this.flightService
            .getOneWayList(reqParamas)
            .subscribe((f) => {
              this.flights = this.sortFlights(f, params['sortBy']);
              this.filterFlights(params); // Apply filtering
            });
        }
      },
      error: (err) => {
        this.error = true;
      },
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  showRoundtipDetails(roundTrip: RoundTrip) {
    this.flightService.selectedFlight.set(null);
    this.flightService.selectedRoundTrip.set(roundTrip);
    this.flightService.showRoundTripDetails(roundTrip);
  }

  showOneWayDetails(oneWay: Flight) {
    this.flightService.selectedRoundTrip.set(null);
    this.flightService.selectedFlight.set(oneWay);
    this.flightService.showOneWayDetails(oneWay);
  }

  private sortFlights(flights: Flight[], sortBy: string | undefined): Flight[] {
    if (!sortBy) return flights;

    switch (sortBy) {
      case 'price-asc':
        return flights.sort((a, b) => a.price - b.price);
      case 'duration-asc':
        return flights.sort((a, b) => a.flight_duration - b.flight_duration);
      case 'Departure-asc':
        return flights.sort(
          (a, b) =>
            new Date(a.depart_date).getTime() -
            new Date(b.depart_date).getTime()
        );
      case 'Departure-desc':
        return flights.sort(
          (a, b) =>
            new Date(b.depart_date).getTime() -
            new Date(a.depart_date).getTime()
        );
      case 'Return-asc':
        return flights.sort(
          (a, b) =>
            new Date(a.arrival_date).getTime() -
            new Date(b.arrival_date).getTime()
        );
      case 'Return-desc':
        return flights.sort(
          (a, b) =>
            new Date(b.arrival_date).getTime() -
            new Date(a.arrival_date).getTime()
        );
      default:
        return flights;
    }
  }

  private filterFlights(params: any): void {
    if (!this.flights) return;

    const minPrice = +params['minPrice'] || 0;
    const maxPrice = +params['maxPrice'] || Infinity;
    const minDuration = +params['minDuration'] || 0;
    const maxDuration = +params['maxDuration'] || Infinity;

    this.flights = this.flights.filter((flight) => {
      const duration = flight.flight_duration;
      const price = flight.price;
      return (
        price >= minPrice &&
        price <= maxPrice &&
        duration >= minDuration &&
        duration <= maxDuration
      );
    });
  }
}
