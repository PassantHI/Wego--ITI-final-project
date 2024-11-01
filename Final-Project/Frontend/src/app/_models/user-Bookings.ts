export class UserBookingDto {
  constructor(
    public bookingId: number,
    public flightId: number,
    public from: string,
    public to: string,
    public departDate: string,
    public arriveDate: string,
    public departTime: string,
    public arriveTime: string,
    public status: string,
    public paymentMethod: string,
    public totalPrice: number,
    public seatsCount: number,
    public seatNumbers: string[]
  ) {}
}
