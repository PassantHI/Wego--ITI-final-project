export class GetAirport {
  constructor(
    public id: number,
    public name: string,
    public code: string,
    public country: string,
    public city: string,
    public locationId: number,
    public terminals: string[],
    public terminalIds: number[]
  ) {}
}
