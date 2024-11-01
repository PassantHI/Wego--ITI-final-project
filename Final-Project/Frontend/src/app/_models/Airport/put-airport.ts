export class PutAirport {
  constructor(
    public id: number,
    public name: string | null = null,
    public code: string | null = null,
    public locationId: number | null = null
  ) {}
}
