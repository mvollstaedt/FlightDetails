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
  }

  set cabinClass(cabinClass) {
    this._cabinClass = cabinClass;
  }

  set flightSchedule(flightSegments) {
    this._flightSegments = flightSegments;
  }

  get startLocation() {
    return this._flightSegments[0].startLocation;
  }

  get endLocation() {
    return this._flightSegments[this._flightSegments.length-1].endLocation;
  }

  get flightDuration() {
    let duration = (this._endDate - this._startDate) / 1000 / 60;
    if (duration <= 0) {
      duration = 0;
      console.log(`Flight Duration of flight ${this._flightNo} was <= 0`);
    }
    return duration;
  }

  get stopoverCount() {
    let count = this._flightSegments.length;
    if (count < 0) {
      count = 0;
      console.log(`Stopover count of flight ${this._flightNo}was somehow < 0`);
    }
    return count;
  }
}

export class FlightRoute {
  constructor(flights, price) {
    this._flights = flights;
    this._price = price;
  }
}
