import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Details } from '../_models/details';

@Injectable({
  providedIn: 'root',
})
export class DetailsService {
  httpClient = inject(HttpClient);
  private readonly port = 7024;
  url = `https://localhost:${this.port}/api/RoomBookingDetails`;
  booking = signal<Details[] | undefined>(undefined);

  creatRoomDetails(details: Details) {
    return this.httpClient.post<{ bookId: number }>(this.url, details);
  }
  getUserBooking() {
    this.httpClient.get<Details[]>(this.url + '/user-booking').subscribe({
      next: (data) => this.booking.set(data),
      error: (err) => console.log(err),
      complete: () => console.log('getUserBooking  : complete '),
    });
  }

  isReserved(roomId: string, checkin: string, checkout: string) {
    return this.httpClient.get<Details[]>(
      this.url +
        `/RoomAvailable?roomId=${roomId}&checkin=${checkin}&checkout=${checkout}`
    );
  }

  getReservedDates(roomId: string) {
    return this.httpClient.get<string[]>(
      this.url + `/reservedDates?roomId=${roomId}`
    );
  }
}
