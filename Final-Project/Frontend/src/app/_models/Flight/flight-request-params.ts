export class FlightRequestParams {
  constructor(
    public departAirportId: number,
    public arrivalAirportId: number,
    public departDate: string,
    public noOfSeats: number,
    public seatClass: number,
    public returnDate: string | undefined = undefined
  ) {}
}
