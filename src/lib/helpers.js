/* eslint-disable import/prefer-default-export,no-restricted-syntax,no-trailing-spaces,no-console */
import moment from 'moment';
import airports from '../data/eu_airports.json';
import airlines from '../data/eu_airlines';
import { Flight, FlightRoute, FlightSegment } from './model';

function getRandTravelTime(min, max) {
  const randNo = Math.random() * (+max - +min) + +min;
  // round up to next multiple of 5
  return Math.ceil(randNo / 5) * 5;
}

function genPrice(travelTime) {
  // 150 euros per hour
  return Math.round(1200 - (travelTime / 60 * 150));
}

function genFlightNo(icao, count = 5) {
  let flightNo = icao;
  const digits = '0123456789';
  const countOfPositions = count;

  for (var i = 0; i < countOfPositions; i++) {
    flightNo += digits.charAt(Math.floor(Math.random() * digits.length));
  }

  return flightNo;
}

export function getAirportList() {
  return airports;
}

// data used for the first start of the component
export function getTripSectionsInitialData() {
  const today = new Date();

  return {
    startDate: today,
    endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
    sections: [
      {
        location: {
          name: "Madrid",
        },
        startDate: today,
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
      },
    ]

  }
}

export function queryFlightRoutes(flightRouteParams) {
  let i = 0;
  const flights = [];
  const self = this;

  for (const flightQuery of flightRouteParams) {
    // get airport data from iata code and city
    let srcAirport;
    let destAirport;

    if (flightQuery.startLocation.iata === '') srcAirport = airports.find(airport => airport.city === flightQuery.startLocation.city);
    else srcAirport = airports.find(airport => airport.iata === flightQuery.startLocation.iata);

    if (flightQuery.endLocation.iata === '') destAirport = airports.find(airport => airport.city === flightQuery.endLocation.city);
    else destAirport = airports.find(airport => airport.iata === flightQuery.endLocation.iata);

    // get airlines which operates in start or end location's country
    const airline = airlines.find(airl => airl.country === srcAirport.country || airl.country === destAirport.country);

    if (srcAirport !== undefined && destAirport !== undefined) {
      for (const depTime of srcAirport.dep_times) {
        if (flights[i] === undefined) flights[i] = [];

        const randTravelTime = getRandTravelTime(60, 180);

        let startTimeAsMoment = moment({
          years: new Date(flightQuery.travelDate).getFullYear(),
          months: new Date(flightQuery.travelDate).getMonth(),
          days: new Date(flightQuery.travelDate).getDay(),
          hours: depTime.split(":")[0],
          minutes: depTime.split(":")[1]
        });

        flights[i].push({
          startLocation: { city: srcAirport.city, iata: srcAirport.iata, input: `${srcAirport.city} (${srcAirport.iata})` },
          endLocation: { city: destAirport.city, iata: destAirport.iata, input: `${destAirport.city} (${destAirport.iata})` },
          startDate: startTimeAsMoment.toDate(),
          endDate: moment(startTimeAsMoment).add(randTravelTime, 'minute').toDate(),
          travelTime: randTravelTime,
          travelDate: flightQuery.travelDate,
          cabinClass: 'Economy',
          flightNo: genFlightNo(airline.icao),
          airline,
          stopovers: 0,
        });
      }
    }
    i += 1;
  }

  const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
  const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);

  const output = cartesian(...flights);

  const flightAlternatives = [];

  // construct flight alternatives array
  // add price (dependent of total travel time
  for (const flightAlt of output) {
    let travelTime = 0;
    for (const flightSegment of flightAlt) {
      travelTime += flightSegment.travelTime;
    }

    const flightAltObj = { price: genPrice(travelTime), flights: flightAlt };
    flightAlternatives.push(flightAltObj);
  }

  return JSON.stringify(flightAlternatives);
}

// parses from http response JSON format to flight route model format
export function ResponseJSONToFlightRoute(flightRouteJSON) {
  let flightRouteTmp = new FlightRoute();
  flightRouteTmp.price = flightRouteJSON.price;

  for (const flight of flightRouteJSON.flights) {
    let flightTmp = new Flight(flight.startDate, flight.endDate, flight.flightNo, flight.airline);
    flightTmp.travelTime = flight.travelTime;
    flightTmp.travelDate = flight.travelDate;

    let flightSegmentTmp = new FlightSegment(flight.startTime, flight.startLocation, flight.endTime, flight.endLocation);
    flightTmp.addFlightSegment(flightSegmentTmp);

    flightRouteTmp.addFlight(flightTmp);
  }
  return flightRouteTmp;
}

// parses from internal flight route representation to flight route model
export function JSONToFlightRoute(flightRouteJSON) {
  let flightRouteTmp = new FlightRoute();
  flightRouteTmp.price = flightRouteJSON.price;

  for (const flight of flightRouteJSON.flights) {
    let flightTmp = new Flight(flight.startDate, flight.endDate, flight.flightNo, flight.airline);
    flightTmp.travelTime = flight.travelTime;
    flightTmp.travelDate = flight.travelDate;

    let flightSegmentTmp = new FlightSegment(flight.startTime, flight.flightSegments[0].startLocation, flight.endTime, flight.flightSegments[0].endLocation);
    flightTmp.addFlightSegment(flightSegmentTmp);

    flightRouteTmp.addFlight(flightTmp);
  }
  return flightRouteTmp;
}

// find out whether an object is empty
export function isEmpty(obj) {

  // null and undefined are "empty"
  if (obj == null) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0)    return false;
  if (obj.length === 0)  return true;

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof obj !== "object") return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }

  return true;
}

export function deepCompare () {
  var i, l, leftChain, rightChain;

  function compare2Objects (x, y) {
    var p;

    // remember that NaN === NaN returns false
    // and isNaN(undefined) returns true
    if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
      return true;
    }

    // Compare primitives and functions.
    // Check if both arguments link to the same object.
    // Especially useful on the step where we compare prototypes
    if (x === y) {
      return true;
    }

    // Works in case when functions are created in constructor.
    // Comparing dates is a common scenario. Another built-ins?
    // We can even handle functions passed across iframes
    if ((typeof x === 'function' && typeof y === 'function') ||
      (x instanceof Date && y instanceof Date) ||
      (x instanceof RegExp && y instanceof RegExp) ||
      (x instanceof String && y instanceof String) ||
      (x instanceof Number && y instanceof Number)) {
      return x.toString() === y.toString();
    }

    // At last checking prototypes as good as we can
    if (!(x instanceof Object && y instanceof Object)) {
      return false;
    }

    if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
      return false;
    }

    if (x.constructor !== y.constructor) {
      return false;
    }

    if (x.prototype !== y.prototype) {
      return false;
    }

    // Check for infinitive linking loops
    if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
      return false;
    }

    // Quick checking of one object being a subset of another.
    // todo: cache the structure of arguments[0] for performance
    for (p in y) {
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        return false;
      }
      else if (typeof y[p] !== typeof x[p]) {
        return false;
      }
    }

    for (p in x) {
      if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
        return false;
      }
      else if (typeof y[p] !== typeof x[p]) {
        return false;
      }

      switch (typeof (x[p])) {
        case 'object':
        case 'function':

          leftChain.push(x);
          rightChain.push(y);

          if (!compare2Objects (x[p], y[p])) {
            return false;
          }

          leftChain.pop();
          rightChain.pop();
          break;

        default:
          if (x[p] !== y[p]) {
            return false;
          }
          break;
      }
    }

    return true;
  }

  if (arguments.length < 1) {
    return true; //Die silently? Don't know how to handle such case, please help...
    // throw "Need two or more arguments to compare";
  }

  for (i = 1, l = arguments.length; i < l; i++) {

    leftChain = []; //Todo: this can be cached
    rightChain = [];

    if (!compare2Objects(arguments[0], arguments[i])) {
      return false;
    }
  }

  return true;
}
