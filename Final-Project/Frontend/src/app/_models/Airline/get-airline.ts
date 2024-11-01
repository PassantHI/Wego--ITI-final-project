export class GetAirline {
  constructor(
    public id: number,
    public name: string,
    public code: string,
    public image: string,
    public flights: number,
    public airplanes: number
  ) {}
}
