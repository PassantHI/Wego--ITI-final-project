import { Component, inject } from '@angular/core';
import { FlightDetailsComponent } from '../flight-details/flight-details.component';
import { FlightService } from '../../../_services/flight.service';
import { Flight } from '../../../_models/Flight/flight';
import { RoundTrip } from '../../../_models/Flight/round-trip';
import { FlightBookingService } from '../../../_services/flight-booking.service';
import { FlightBookingDto } from '../../../_models/FlightBookingDto';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckoutDto } from '../../../_models/checkoutDto';
import { PaymentService } from '../../../_services/payment.service';

@Component({
  selector: 'app-flight-detail-viewer',
  standalone: true,
  imports: [FlightDetailsComponent],
  templateUrl: './flight-detail-viewer.component.html',
  styleUrl: './flight-detail-viewer.component.css',
})
export class FlightDetailViewerComponent {
  isVisible = false;
  isRoundtrip = false;
  roundTrip: RoundTrip | null = null;
  oneWay: Flight | null = null;
  price: number | null = null;
  private seatClassValue: number | null = null;
  private numberOfSeats: number | null = null;
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly flightBookingService = inject(FlightBookingService);
  private readonly paymentService = inject(PaymentService);

  constructor(public flightService: FlightService) {}

  ngOnInit() {
    this.flightService.visibility$.subscribe((visible) => {
      this.isVisible = visible;
      this.isRoundtrip = this.flightService.isRoundTrip;

      if (this.isRoundtrip) {
        this.roundTrip = this.flightService.selectedRoundTrip();
        this.price = this.roundTrip?.totalPrice!;
      } else {
        this.oneWay = this.flightService.selectedFlight();
        this.price = this.oneWay?.price!;
      }
      this.activeRoute.queryParams.subscribe({
        next: (p) => {
          this.seatClassValue = +p['class'];
          this.numberOfSeats = +p['seats'];
          if (
            (!this.seatClassValue && this.seatClassValue != 0) ||
            !this.numberOfSeats
          )
            this.router.navigateByUrl('/flights');
        },
      });
    });
  }

  hideDetails() {
    this.flightService.hideFlightDetails();
  }

  startCheckout() {
    const flightsIds: number[] = [];
    if (this.isRoundtrip) {
      flightsIds.push(this.roundTrip!.departFlight.id);
      flightsIds.push(this.roundTrip!.returnFlight.id);
    } else flightsIds.push(this.oneWay!.id);

    const requestBody = new FlightBookingDto(
      'card',
      flightsIds,
      this.numberOfSeats!,
      this.seatClassValue!
    );
    this.flightBookingService.createFlightBooking(requestBody).subscribe({
      next: (res) => {
        const bookingIds = res.bookingIds.map((id) => id.toString());
        const amount = res.totalPrice;
        const checkoutData = new CheckoutDto(
          'flights',
          'http://localhost:4200/flights/',
          bookingIds,
          amount/this.numberOfSeats!,
          `Flight Ticket/s`,
          this.numberOfSeats!
        );
        this.paymentService.payNow(checkoutData).subscribe({
          next: (res) => {
            window.location.href = res.url;
          },
        });
      },
    });
  }
}
