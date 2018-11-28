/* eslint-disable import/prefer-default-export */
import { Flight, FlightSegment, FlightRoute } from './model';

export function getFlightRouteDummyData() {
  const today = new Date();

  let flightSegment11 = new FlightSegment('06:00', 'Berlin (TXL)', '08:40', 'Lissabon (LIS)');
  let flightSegment12 = new FlightSegment('19:00', 'Lissabon (LIS)', '21:50', 'Barcelona (BCN)');
  let flightSegment21 = new FlightSegment('15:35', 'Barcelona (BCN)', '00:15', 'Marokko (CMN)');
  let flightSegment31 = new FlightSegment('16:35', 'Marokko (CMN)', '13:40', 'Berlin (TXL)');

  let flight1 = new Flight(today, today, 'TP531', 'TAP Air Portugal');
  flight1.flightSchedule = [flightSegment11, flightSegment12];
  let flight2 = new Flight(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5), new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6), 'TP531', 'TAP Air Portugal');
  flight2.flightSchedule = [flightSegment21];
  let flight3 = new Flight(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9), new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10), 'TP531', 'TAP Air Portugal');
  flight3.flightSchedule = [flightSegment31];

  let flightRoute = new FlightRoute([flight1, flight2, flight3], 1000);

  return [
    {
      price: '400 €',
      pinned: false,
      flights: [
        {
          startLocation: 'Berlin (TXL)',
          endLocation: 'Barcelona (BCN)',
          startTime: '06:30',
          endTime: '09:30',
          travelTime: '180',
          travelDate: today,
          cabinClass: 'Economy',
          stopovers: 1,
        },
        {
          startLocation: 'Barcelona (BCN)',
          endLocation: 'Madrid (MAD)',
          startTime: '10:00',
          endTime: '11:00',
          travelTime: '60',
          travelDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
          cabinClass: 'Economy',
          stopovers: 0,
        },
        {
          startLocation: 'Berlin (TXL)',
          endLocation: 'Madrid (MAD)',
          startTime: '12:00',
          endTime: '15:00',
          travelTime: '180',
          travelDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
          cabinClass: 'Economy',
          stopovers: 0,
        },
      ],
    },
    {
      price: '500 €',
      pinned: false,
      flights:
        [
          {
            startLocation: 'Berlin (SXF)',
            endLocation: 'Barcelona (BCN)',
            startTime: '02:30',
            endTime: '05:30',
            travelTime: '180',
            travelDate: today,
            cabinClass: 'Economy',
            stopovers: 0,
          },
          {
            startLocation: 'Barcelona (BCN)',
            endLocation: 'Madrid (MAD)',
            startTime: '06:30',
            endTime: '07:30',
            travelTime: '60',
            travelDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
            cabinClass: 'Economy',
            stopovers: 0,
          },
          {
            startLocation: 'Berlin (SXF)',
            endLocation: 'Madrid (MAD)',
            startTime: '09:00',
            endTime: '12:00',
            travelTime: '180',
            travelDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
            cabinClass: 'Economy',
            stopovers: 0,
          },
        ],
    },
    {
      price: '1024 €',
      pinned: false,
      flights:
        [
          {
            startLocation: 'Berlin (SXF)',
            endLocation: 'Barcelona (BCN)',
            startTime: '08:30',
            endTime: '11:30',
            travelTime: '180',
            travelDate: today,
            cabinClass: 'Economy',
            stopovers: 0,
          },
          {
            startLocation: 'Barcelona (BCN)',
            endLocation: 'Madrid (MAD)',
            startTime: '12:30',
            endTime: '13:30',
            travelTime: '60',
            travelDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
            cabinClass: 'Economy',
            stopovers: 0,
          },
          {
            startLocation: 'Berlin (SXF)',
            endLocation: 'Madrid (MAD)',
            startTime: '15:00',
            endTime: '16:00',
            travelTime: '180',
            travelDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
            cabinClass: 'Economy',
            stopovers: 0,
          },
        ],
    },
  ];
}

export function getDestinationList() {
  return [
    { id: 'BCN', city: 'Barcelona' },
    { id: 'MAD', city: 'Madrid' },
    { id: 'alle', city: 'Berlin' },
    { id: 'TXL', city: 'Berlin' },
    { id: 'SXF', city: 'Berlin' },
    { id: 'alle', city: 'Frankfurt am Main' },
    { id: 'FRA', city: 'Frankfurt am Main' },
    { id: 'HHN', city: 'Frankfurt am Main' },
    { id: 'BIO', city: 'Bilbao' },
    { id: 'ATL', city: 'Atlanta' },
    { id: 'PEK', city: 'Peking' },
    { id: 'DXB', city: 'Dubai' },
    { id: 'LAX', city: 'Los Angeles' },
    { id: 'CDG', city: 'Paris' },
  ];
}

export function getCurrentFlightRouteDummy() {
  const today = new Date();

  return [
    {
      startLocation: 'Berlin (TXL)',
      endLocation: 'Barcelona (BCN)',
      travelDate: today,
    },
    {
      startLocation: 'Barcelona (BCN)',
      endLocation: 'Madrid (MAD)',
      travelDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
    },
    {
      startLocation: 'Madrid (MAD)',
      endLocation: 'Berlin (TXL)',
      travelDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
    },
  ];
}
