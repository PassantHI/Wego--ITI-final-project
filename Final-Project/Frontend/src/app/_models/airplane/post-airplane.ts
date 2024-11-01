export class PostAirplane {
  constructor(
    public code: string,
    public type: string,
    public airlineId: number,
    public featureNames: string[],
    public economySeats: number,
    public firstClassSeats: number,
    public businessSeats: number
  ) {}
}
