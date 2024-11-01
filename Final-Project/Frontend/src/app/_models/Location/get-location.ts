export class GetLocation {
  constructor(
    public id: number,
    public country: string,
    public city: string,
    public imageUrl: string,
    public airportCount: number,
    public airports: string[],
    public categoryIds: number[],
    public categories: string[]
  ) {}
}
