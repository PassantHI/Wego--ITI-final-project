import { Component, inject, OnInit } from '@angular/core';
import { FlightBookingService } from '../../../_services/flight-booking.service';
import { UserBookingDto } from '../../../_models/user-Bookings';

@Component({
  selector: 'app-user-flight-bookings',
  standalone: true,
  imports: [],
  templateUrl: './user-flight-bookings.component.html',
  styleUrl: './user-flight-bookings.component.css',
})
export class UserFlgihtBookingsComponent implements OnInit {
  private readonly flightBookingService = inject(FlightBookingService);
  userBookings: UserBookingDto[] = [];

  ngOnInit(): void {
    this.flightBookingService.getUserBookings().subscribe({
      next: (res) => {
        this.userBookings = res;
      },
    });
  }
}
