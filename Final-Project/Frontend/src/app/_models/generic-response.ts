export class GenericResponse<T> {
  constructor(public data: T[], public total: number) {}
}
