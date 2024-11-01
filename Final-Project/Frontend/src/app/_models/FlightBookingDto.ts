export class FlightBookingDto {
  constructor(
    public paymentMethod: string,
    public FlightIds: number[],
    public numberOfSeats: number,
    public classOfSeats: number
  ) {}
}
