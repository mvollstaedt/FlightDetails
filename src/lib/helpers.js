/* eslint-disable import/prefer-default-export,no-restricted-syntax,no-trailing-spaces,no-console */
import moment from 'moment';
import { Flight, FlightSegment, FlightRoute } from './model';
import airports from '../data/eu_airports.json';
import airlines from '../data/eu_airlines';

function getRandTravelTime(min, max) {
  const randNo = Math.random() * (+max - +min) + +min;
  // round up to next multiple of 5
  return Math.ceil(randNo / 5) * 5;
}

function genPrice(travelTime) {
  // 150 euros per hour
  return Math.round(travelTime / 60 * 150);
}

function genFlightNo(callsign, count = 5) {
  let flightNo = callsign;
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

/*
  Format:
  flightRouteParams = [
    [
      startLocation: '',
      endLocation: '',
      travelDate: Date,
    ],
    ...
  ]
 */

export function getCurrentFlightRouteDummy() {
  const today = new Date();

  return [
    {
      startLocation: {
        input: 'Berlin (SXF)',
        city: 'Berlin',
        iata: 'SXF',
      },
      endLocation: {
        input: 'Barcelona (BCN)',
        city: 'Barcelona',
        iata: 'BCN',
      },
      travelDate: today,
    },
    {
      startLocation: {
        input: 'Barcelona (BCN)',
        city: 'Barcelona',
        iata: 'BCN',
      },
      endLocation: {
        input: 'Madrid (MAD)',
        city: 'Madrid',
        iata: 'MAD',
      },
      travelDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
    },
    {
      startLocation: {
        input: 'Madrid (MAD)',
        city: 'Madrid',
        iata: 'MAD',
      },
      endLocation: {
        input: 'Berlin (SXF)',
        city: 'Berlin',
        iata: 'SXF',
      },
      travelDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
    },
  ];
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

        if (isNaN(moment(depTime, 'hh:mm'))) console.log(depTime);

        flights[i].push({
          startLocation: { city: srcAirport.city, iata: srcAirport.iata, input: `${srcAirport.city} (${srcAirport.iata})` },
          endLocation: { city: destAirport.city, iata: destAirport.iata, input: `${destAirport.city} (${destAirport.iata})` },
          startTime: depTime,
          endTime: moment(depTime, 'hh:mm').add(randTravelTime, 'minute').format('hh:mm'),
          travelTime: randTravelTime,
          travelDate: flightQuery.travelDate,
          cabinClass: 'Economy',
          flightNo: genFlightNo(),
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
