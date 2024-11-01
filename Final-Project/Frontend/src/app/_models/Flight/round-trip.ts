import { Flight } from './flight';

export class RoundTrip {
  public totalPrice: number = 0;

  constructor(public departFlight: Flight, public returnFlight: Flight) {
    this.totalPrice = this.departFlight.price + this.returnFlight.price;
  }
}
