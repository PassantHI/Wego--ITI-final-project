export class GetAirplane {
  constructor(
    public id: string,
    public code: string,
    public type: string,
    public airline: string,
    public airlineId: number,
    public totalFlights: number,
    public totalSeats: number,
    public features: string[]
  ) {}
}
