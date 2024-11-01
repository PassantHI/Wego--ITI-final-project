import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  httpClient = inject(HttpClient);
  private readonly port = 7024;

  url = `https://localhost:44389/${this.port}/Booking`;

  /* createBooking(booking:Booking){

    return this.httpClient.post(this.url,booking);
  }
 */
}
