/* eslint-disable import/prefer-default-export,no-trailing-spaces,no-underscore-dangle,no-underscore-dangle */
export class FlightSegment {
  constructor(startTime, startLocation, endTime, endLocation) {
    this.startTime = startTime;
    this.endTime = endTime;

    this.startLocation = startLocation;
    this.endLocation = endLocation;
  }

  set airline(airline) {
    this.airline = airline;
  }

  get airline() {
    return this.airline;
  }

  set segmentNo(segmentNo) {
    this.segmentNo = segmentNo;
  }

  get segmentNo() {
    return this.segmentNo;
  }
}

export class Flight {

  constructor(startDate, endDate, flightNo, airline) {
    this.startDate = startDate;
    this.endDate = endDate;

    this.flightNo = flightNo;
    this.airline = airline;

    this.cabinClass = 'Economy';
    this.flightSegments = [];

    this.travelDate = new Date();
    this.travelTime = 0;
  }

  get startLocation() {
    return this.flightSegments[0].startLocation;
  }

  get endLocation() {
    return this.flightSegments[this.flightSegments.length-1].endLocation;
  }

  get stopoverCount() {
    let count = this.flightSegments.length - 1;
    if (count < 0) {
      count = 0;
    }
    return count;
  }

  addFlightSegment(flightSegment) {
    this.flightSegments.push(flightSegment);
  }
}

export class FlightRoute {
  constructor(flights = [], price = 0) {
    this.flights = flights;
    this.price = price;
  }

  addFlight(flight) {
    this.flights.push(flight);
  }

  get travelTime() {
    let totalTravelTime = 0;
    for (var flight of this.flights) {
      totalTravelTime = totalTravelTime + flight.travelTime;
    }
    return totalTravelTime;
  }
}
