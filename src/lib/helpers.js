/* eslint-disable import/prefer-default-export,no-restricted-syntax,no-trailing-spaces,no-console */
import moment from 'moment';
import { Flight, FlightSegment, FlightRoute } from './model';
import airports from '../data/eu_airports.json';

function getRandTravelTime(min, max) {
  const randNo = Math.random() * (+max - +min) + +min;
  // round up to next multiple of 5
  return Math.ceil(randNo / 5) * 5;
}

function genPrice(travelTime) {
  // 150 euros per hour
  return Math.round(travelTime / 60 * 150);
}

export function getFlightRouteDummyData() {
  const today = new Date();

  const flightSegment11 = new FlightSegment('06:00', 'Berlin (TXL)', '08:40', 'Lissabon (LIS)');
  const flightSegment12 = new FlightSegment('19:00', 'Lissabon (LIS)', '21:50', 'Barcelona (BCN)');
  const flightSegment21 = new FlightSegment('15:35', 'Barcelona (BCN)', '00:15', 'Marokko (CMN)');
  const flightSegment31 = new FlightSegment('16:35', 'Marokko (CMN)', '13:40', 'Berlin (TXL)');

  const flight1 = new Flight(today, today, 'TP531', 'TAP Air Portugal');
  flight1.flightSchedule = [flightSegment11, flightSegment12];
  const flight2 = new Flight(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5), new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6), 'TP531', 'TAP Air Portugal');
  flight2.flightSchedule = [flightSegment21];
  const flight3 = new Flight(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9), new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10), 'TP531', 'TAP Air Portugal');
  flight3.flightSchedule = [flightSegment31];

  const flightRoute1 = new FlightRoute([flight1, flight2, flight3], 1000);

  return [
    {
      price: '400 €',
      pinned: false,
      flights: [
        {
          startLocation: {
            city: 'Berlin',
            iata: 'SXF',
            input: 'Berlin (SXF)',
          },
          endLocation: {
            city: 'Barcelona',
            iata: 'BCN',
            input: 'Barcelona (BCN)',
          },
          startTime: '06:30',
          endTime: '09:30',
          travelTime: '180',
          travelDate: today,
          cabinClass: 'Economy',
          stopovers: 0,
        },
        {
          startLocation: {
            city: 'Barcelona',
            iata: 'BCN',
            input: 'Barcelona (BCN)',
          },
          endLocation: {
            city: 'Madrid',
            iata: 'MAD',
            input: 'Madrid (MAD)',
          },
          startTime: '10:00',
          endTime: '11:00',
          travelTime: '60',
          travelDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
          cabinClass: 'Economy',
          stopovers: 0,
        },
        {
          endLocation: {
            city: 'Berlin',
            iata: 'SXF',
            input: 'Berlin (SXF)',
          },
          startLocation: {
            city: 'Madrid',
            iata: 'MAD',
            input: 'Madrid (MAD)',
          },
          startTime: '12:00',
          endTime: '15:00',
          travelTime: '180',
          travelDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
          cabinClass: 'Economy',
          stopovers: 0,
        },
      ],
    },
  ];
}

export function getAirportList() {
  return airports;
}

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
export function queryFlightRoutes(flightRouteParams) {
  let i = 0;
  const flightSegments = [];
  const self = this;

  for (const flight of flightRouteParams) {
    // get airport data from iata code and city
    let srcAirport; let
      destAirport;

    if (flight.startLocation.iata === '') srcAirport = airports.find(airport => airport.city === flight.startLocation.city);
    else srcAirport = airports.find(airport => airport.iata === flight.startLocation.iata);

    if (flight.endLocation.iata === '') destAirport = airports.find(airport => airport.city === flight.endLocation.city);
    else destAirport = airports.find(airport => airport.iata === flight.endLocation.iata);

    if (srcAirport !== undefined && destAirport !== undefined) {
      for (var depTime of srcAirport.dep_times) {
        if (flightSegments[i] === undefined) flightSegments[i] = [];

        let randTravelTime = getRandTravelTime(60, 180);

        if (isNaN(moment(depTime, 'hh:mm'))) console.log(depTime);

        flightSegments[i].push({
          startLocation: { city: srcAirport.city, iata: srcAirport.iata, input: `${srcAirport.city} (${srcAirport.iata})` },
          endLocation: { city: destAirport.city, iata: destAirport.iata, input: `${destAirport.city} (${destAirport.iata})` },
          startTime: depTime,
          endTime: moment(depTime, 'hh:mm').add(randTravelTime, 'minute').format('hh:mm'),
          travelTime: randTravelTime,
          travelDate: flight.travelDate,
          cabinClass: 'Economy',
          stopovers: 0,
        });
      }
    }
    i += 1;
  }

  const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
  const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);

  let output = cartesian(...flightSegments);

  let flightAlternatives = [];

  // construct flight alternatives array
  // add price (dependent of total travel time
  for (const flightAlt of output) {
    let travelTime = 0;
    for (const flightSegment of flightAlt) {
      travelTime += flightSegment.travelTime;
    }

    let flightAltObj = { price: genPrice(travelTime), flights: flightAlt };
    flightAlternatives.push(flightAltObj);
  }

  return flightAlternatives;
}
