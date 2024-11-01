export class PutTerminal {
  constructor(
    public id: number,
    public name: string | null = null,
    public airportId: number | null = null
  ) {}
}
