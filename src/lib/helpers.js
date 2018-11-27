/* eslint-disable import/prefer-default-export */
export function getFlightRouteDummyData() {
  const today = new Date();

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
