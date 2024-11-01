export class PutAirplane {
  constructor(
    public id: number,
    public code: string | null = null,
    public type: string | null = null,
    public airlineId: number | null = null,
    public featureNames: string[]
  ) {}
}
