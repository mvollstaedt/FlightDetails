/* eslint-disable import/prefer-default-export,no-trailing-spaces */
export class FlightSegment {
  constructor(startDate, startLocation, endDate, endLocation) {
    this._startDate = startDate;
    this._endDate = endDate;

    this._startLocation = startLocation;
    this._endLocation = endLocation;
  }

  set airline(airline) {
    this._airline = airline;
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
  }

  set cabinClass(cabinClass) {
    this._cabinClass = cabinClass;
  }

  set flightSchedule(flightSegments) {
    this._flightSegments = flightSegments;
  }
}

export class FlightRoute {
  constructor(flights, price) {
    this._flights = flights;
    this._price = price;
  }
}
