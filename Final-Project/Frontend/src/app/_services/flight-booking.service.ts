import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FlightBookingDto } from '../_models/FlightBookingDto';
import { UserBookingDto } from '../_models/user-Bookings';

@Injectable({
  providedIn: 'root',
})
export class FlightBookingService {
  private readonly apiUrl = `https://localhost:7024/api/FlightBookings`;
  private client = inject(HttpClient);
  createFlightBooking(data: FlightBookingDto) {
    return this.client.post<{ bookingIds: number[]; totalPrice: number }>(
      this.apiUrl,
      data
    );
  }

  getUserBookings() {
    return this.client.get<UserBookingDto[]>(this.apiUrl + '/my-bookings');
  }
}
