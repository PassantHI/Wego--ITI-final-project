import { AirplaneFeatures } from './airplane-features';

export class Flight {
  constructor(
    public id: number,
    public depart_airport_code: string,
    public depart_airport_name: string,
    public arrival_airport_code: string,
    public arrival_airport_name: string,
    public depart_date: Date,
    public arrival_date: Date,
    public flight_duration: number,
    public depart_terminal: string,
    public arrival_terminal: string,
    public airline_name: string,
    public airline_logo: string,
    public airplane_code: string,
    public airplane_type: string,
    public trip_class: string,
    public price: number,
    public features: AirplaneFeatures,
    public available_seats: number | null = null
  ) {}
}
