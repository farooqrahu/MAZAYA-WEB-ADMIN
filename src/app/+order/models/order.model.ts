export interface MyOrder {
  flightDetails?: any;
}

export enum ProgressIndex {
  flight = 1,
  order = 2,
  package = 3,
  passenger = 4,
  location = 5
}