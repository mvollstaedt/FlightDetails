/* eslint-disable import/prefer-default-export,no-trailing-spaces,no-underscore-dangle,no-underscore-dangle */
export class FlightSegment {
  constructor(startTime, startLocation, endTime, endLocation) {
    this._startTime = startTime;
    this._endTime = endTime;

    this._startLocation = startLocation;
    this._endLocation = endLocation;
  }

  set airline(airline) {
    this._airline = airline;
  }

  get airline() {
    return this._airline;
  }

  set segmentNo(segmentNo) {
    this._segmentNo = segmentNo;
  }
}

export class Flight {
  constructor(startDate, endDate, flightNo, airline) {
    this._startDate = startDate;
    this._endDate = endDate;

    this._flightNo = flightNo;
    this._airline = airline;

    this._cabinClass = 'Economy';
    this._flightSegments = [];

    this._travelDate = new Date();
    this._travelTime = 0;
  }

  set cabinClass(cabinClass) {
    this._cabinClass = cabinClass;
  }

  set flightSchedule(flightSegments) {
    this._flightSegments = flightSegments;
  }

  get startDate() {
    return this._startDate;
  }

  get endDate() {
    return this._endDate;
  }

  get flightNo() {
    return this._flightNo;
  }

  get airline() {
    return this._airline;
  }

  get cabinClass() {
    return this._cabinClass;
  }

  get startLocation() {
    return this._flightSegments[0]._startLocation;
  }

  get endLocation() {
    return this._flightSegments[this._flightSegments.length-1]._endLocation;
  }

  get travelTime() {
    return this._travelTime;
  }

  set travelTime(travelTime) {
    this._travelTime = travelTime;
  }

  get travelDate() {
    return this._travelDate;
  }

  set travelDate(travelDate) {
    this._travelDate = travelDate;
  }

  get stopoverCount() {
    let count = this._flightSegments.length - 1;
    if (count < 0) {
      count = 0;
    }
    return count;
  }

  addFlightSegment(flightSegment) {
    this._flightSegments.push(flightSegment);
  }
}

export class FlightRoute {
  constructor(flights = [], price = 0) {
    this._flights = flights;
    this._price = price;
  }

  set flights(flights) {
    this._flights = flights;
  }

  get flights() {
    return this._flights;
  }

  addFlight(flight) {
    this._flights.push(flight);
  }

  set price(price) {
    this._price = price;
  }

  get price() {
    return this._price;
  }

  get travelTime() {
    let totalTravelTime = 0;
    for (var flight of this._flights) {
      totalTravelTime = totalTravelTime + flight.travelTime;
    }
    return totalTravelTime;
  }
}
