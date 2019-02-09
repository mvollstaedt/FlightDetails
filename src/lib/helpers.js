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
  let price = Math.round(1200 - (travelTime / 60 * 150));
  if (price <= 0) price = 300;
  return price;
}

function genFlightNo(icao, count = 5) {
  let flightNo = icao;
  const digits = '0123456789';
  const countOfPositions = count;

  for (let i = 0; i < countOfPositions; i++) {
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
    endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 20),
    sections: [
      {
        location: 'Madrid',
        startDate: today,
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15),
      },
      {
        location: 'Barcelona',
        startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15),
        endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 20),
      },
    ],

  };
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

        const randTravelTime = getRandTravelTime(90, 180);

        const startTimeAsMoment = moment({
          years: new Date(flightQuery.travelDate).getFullYear(),
          months: new Date(flightQuery.travelDate).getMonth(),
          days: new Date(flightQuery.travelDate).getDate(),
          hours: depTime.split(':')[0],
          minutes: depTime.split(':')[1],
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

  // check for validity of flights of a flight route
  const results = checkValidityOfResults(flightAlternatives);
  return JSON.stringify(results);
}

// parses from http response JSON format to flight route model format
export function ResponseJSONToFlightRoute(flightRouteJSON) {
  const flightRouteTmp = new FlightRoute();
  flightRouteTmp.price = flightRouteJSON.price;

  for (const flight of flightRouteJSON.flights) {
    const flightTmp = new Flight();

    const endDate1 = moment(flight.startDate).add(20, 'minutes').toDate();
    const startDate2 = moment(flight.startDate).add(40, 'minutes').toDate();

    const endLocation1 = { city: "Paris", iata: "CDG", input: 'Paris (CDG)'};
    const startLocation2 = endLocation1;

    //const flightSegmentTmp1 = new FlightSegment(flight.startDate, flight.startLocation, endDate1, endLocation1, flight.flightNo, flight.cabinClass, flight.airline);
    //const flightSegmentTmp2 = new FlightSegment(startDate2, startLocation2, flight.endDate, flight.endLocation, flight.flightNo, flight.cabinClass, flight.airline);
    //flightTmp.addFlightSegment(flightSegmentTmp1);
    //flightTmp.addFlightSegment(flightSegmentTmp2);
    const flightSegmentTmp = new FlightSegment(flight.startDate, flight.startLocation, flight.endDate, flight.endLocation, flight.flightNo, flight.cabinClass, flight.airline);
    flightTmp.addFlightSegment(flightSegmentTmp);

    flightRouteTmp.addFlight(flightTmp);
  }
  return flightRouteTmp;
}

function checkValidityOfResults(flightAlternatives) {
  const prunedFlightAlternatives = [];
  let resultIsValid;

  for (const flightRoute of flightAlternatives) {
    resultIsValid = true;

    for (let i = 0; i < flightRoute.flights.length; i++) {
      if (flightRoute.flights[i + 1] === undefined) break;

      // if end date of previous flight comes after start date of next flight the whole
      // flight route is rendered invalid
      if (moment(flightRoute.flights[i].endDate).isAfter(moment(flightRoute.flights[i + 1].startDate))) {
        resultIsValid = false;
        break;
      }
    }

    if (resultIsValid) prunedFlightAlternatives.push(flightRoute);
  }

  return prunedFlightAlternatives;
}

// find out whether an object is empty
export function isEmpty(obj) {
  // null and undefined are "empty"
  if (obj == null) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof obj !== 'object') return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (const key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }

  return true;
}

export function relevantTripDetailsChanged(oldTripSections, newTripSections) {
  // new infos are always better than no infos
  if (oldTripSections === null) return true;

  // check for number of sections
  if (oldTripSections.sections.length !== newTripSections.sections.length) return true;

  // check start and end dates of the whole trip
  if (!moment(oldTripSections.startDate).isSame(moment(newTripSections.startDate))) return true;
  if (!moment(oldTripSections.endDate).isSame(moment(newTripSections.endDate))) return true;

  // check relevant details in sections
  for (const oldSection of oldTripSections.sections) {
    const equivalentSections = newTripSections.sections.filter(newSection => (oldSection.location === newSection.location
          && moment(oldSection.startDate).isSame(moment(newSection.startDate))
          && moment(oldSection.endDate).isSame(moment(newSection.endDate))));

    // if there is no equivalent section
    if (equivalentSections === null || equivalentSections.length === 0) return true;
  }

  return false;
}


export function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function removeFromLocalStorage(key) {
  return localStorage.removeItem(key);
}

export const LocalStorageKeys = {
  FLIGHTROUTE: 'flightRouteData',
  TRIPSECTIONS: 'tripSectionsData',
};

// check if start and end date are on the same day,
// otherwise show "+1" to indicate that
export function isSameDay(startDateStr, travelTime, endDateStr) {
  let startTimeMoment = moment(startDateStr);
  let endDate = new Date(endDateStr);
  let endDateMoment;

  let startDateMoment = moment({ years: endDate.getFullYear(), months: endDate.getMonth(), days: endDate.getDay(), hours: startTimeMoment.hours(), minutes: startTimeMoment.minutes()});
  endDateMoment = moment(startDateMoment).add(travelTime / 1000 / 60, 'minutes');
  return startDateMoment.isSame(endDateMoment, 'days');
}
