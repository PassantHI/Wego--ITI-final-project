export class PostFlight {
    constructor(
        public departureTime:Date,
        public arrivalTime:Date,
        public status:number,
        public priceEconomyClass:number,
        public priceBusinessClass:number,
        public priceFirstClass:number,
        public airlineId:number,
        public airplaneId:number,
        public departureTerminalId:number,
        public arrivalTerminalId:number
    ){}
}
