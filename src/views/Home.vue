<template lang="pug">
  .home
    section.flight-request-form.section
      .columns.is-mobile.has-text-left(v-for="(flight, index) in currentFlightRoute")
        .column.is-1
          .flight-section-number {{ index + 1 }}
        .column
          b-field(:label="index === 0 ? 'From' : ''")
            b-autocomplete(
              rounded
              v-model="flight.startLocation"
              :data="filteredDataArray"
              placeholder="Start Destination"
              @select="option => flight.startLocation = option")
              template(slot="empty") No results found
        .column
          b-field(:label="index === 0 ? 'To' : ''")
            b-autocomplete(
            rounded
            v-model="flight.endLocation"
            :data="filteredDataArray"
            placeholder="End Destination"
            @select="option => flight.endLocation = option")
              template(slot="empty") No results found
        .column
          b-field(:label="index === 0 ? 'When' : ''")
            b-datepicker(
              rounded
              placeholder="Click to select..."
              :min-date="minDate"
              :max-date="maxDate"
              v-model="flight.travelDate")
    .columns
      aside.section.menu.filter-options.column.is-4.has-text-left
        .filter-option
          p.menu-label.filter-option__header
            | Stopovers
          .filter-option__body
            b-field
              b-checkbox(v-model="filters.stopovers" native-value="0") 0 Stopovers
            b-field
              b-checkbox(v-model="filters.stopovers" native-value="1") 1 Stopover
            b-field
            b-checkbox(v-model="filters.stopovers" native-value="2") 2 Stopovers
        .filter-option
          p.menu-label.filter-option__header
            | Travel Times
          .filter-option__body
            b-field(v-for="(travelTime, index) in filters.travelTimes"
            v-bind:label="currentFlightRoute[index].startLocation + ' - ' + currentFlightRoute[index].endLocation")
              vue-slider(ref="slider" v-model="filters.travelTimes[index]", v-bind="options", class="traveltimes-slider")
        .filter-option
          p.menu-label.filter-option__header
            | Total Travel Time
          .filter-option__body

      section.flight-route-results.section.column.is-8
        .columns.flight-route-result(v-for="(flightRouteResult, index) in filteredFlightRouteList")
            .column.is-9
              .column
                .columns.is-mobile.flight-info(v-for="flight in flightRouteResult.flights")
                  .column.is-1
                    | LOGO
                  .column.is-7
                    p {{ flight.travelTime + ' min' }}
                    .is-vertical-centered
                      .flight-start
                        .flight-location {{ flight.startLocation }}
                        .flight-time {{ flight.startTime }}
                      .flight-hr {{ '----' }}
                      .flight-end
                        .flight-location {{ flight.endLocation }}
                        .flight-time {{ flight.endTime }}
            .column.is-3.is-vertical-centered.is-vertically-stacked
                .flight-route-price {{ flightRouteResult.price }}
                button.button.is-medium.is-primary(@click="pinFlight(flightRouteResult)") {{ flightRouteResult.pinned ? 'Unpin Flight' : 'Pin Flight' }}


</template>

<script>
// @ is an alias to /src
import BField from 'buefy/src/components/field/Field.vue';
import BAutocomplete from 'buefy/src/components/autocomplete/Autocomplete.vue';
import BDatepicker from 'buefy/src/components/datepicker/Datepicker.vue';
import VueSlider from 'vue-slider-component';

export default {
  name: 'home',
  components: {
    BDatepicker,
    BAutocomplete,
    BField,
    VueSlider,
  },
  data() {
    const today = new Date();

    return {
      date: new Date(),
      minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      maxDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 365),

      value: ['00:00', '23:59'],
      options: {
        data: [],
        tooltipDir: 'bottom',
      },

      flightLocations: [
        'Barcelona (BCN)',
        'Barcelona (BLA)',
        'Madrid (MAD)',
        'Berlin (alle)',
        'Berlin (TXL)',
        'Berlin (SXF)',
        'Frankfurt am Main (alle)',

        'Frankfurt am Main (FRA)',
        'Frankfurt-Hahn (HHN)',
        'Bilbao (BIO)',
      ],

      flightRouteResults: [
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
      ],

      name: '',
      startLocation: null,
      endLocation: null,
      currentFlightRoute: [
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
      ],

      filters: {
        stopovers: ['0'],
        travelTimes: [[
          '00:00', '23:59',
        ],
        [
          '00:00', '23:59',
        ],
        [
          '00:00', '23:59',
        ]],
      },

      currentTrip: [

      ],
    };
  },
  methods: {
    pinFlight(flightRouteResult) {
      var pinned = flightRouteResult.pinned;

      for (var flightRoute of this.flightRouteResults) {
        flightRoute.pinned = false;
      }

      if (pinned) {
        this.$toast.open('Flight Route was unpinned.');
        flightRouteResult.pinned = false;
      } else {
        this.$toast.open('Flight Route was pinned.');
        flightRouteResult.pinned = true;
      }
    },

    timeInTimespan(time, timespan) {
      const timespanTemp = [timespan[0].split(':'), timespan[1].split(':')];
      const timeTemp = time.split(':');

      const startDate = new Date(2012, 10, 2, parseInt(timespanTemp[0][0]), parseInt(timespanTemp[0][1]));
      const endDate = new Date(2012, 10, 2, parseInt(timespanTemp[1][0]), parseInt(timespanTemp[1][1]));
      const travelDate = new Date(2012, 10, 2, parseInt(timeTemp[0]), parseInt(timeTemp[1]));

      return startDate <= travelDate && endDate >= travelDate;
    },
  },
  computed: {
    filteredDataArray() {
      return this.flightLocations.filter(option => option
        .toString()
        .toLowerCase()
        .indexOf(this.name.toLowerCase()) >= 0);
    },

    filteredFlightRouteList() {
      // if stopovers are changing
      let filteredList = this.flightRouteResults.filter((flightRouteResult) => {
        for (var flight of flightRouteResult.flights) {
          if (this.filters.stopovers.some(val => val === flight.stopovers.toString())) {
            continue;
          }
          return false;
        }
        return true;
      });

      // if travel time range slider is changing
      filteredList = filteredList.filter((flightRouteResult) => {
        var i = 0;
        for (var flight of flightRouteResult.flights) {
          if (this.timeInTimespan(flight.startTime, this.filters.travelTimes[i])
              && this.timeInTimespan(flight.endTime, this.filters.travelTimes[i])) {
            i++;
            console.log('test');
            continue;
          }
          return false;
        }
        return true;
      });

      return filteredList;
    },
  },
  mounted() {
    // fill hours for travel time slider options
    for (let i = 0; i < 49; i++) {
      let time = '';
      if (i === 0) time = '00:00';
      else if (i === 48) time = '23:59';
      else if (i % 2 === 0) {
        if (i < 20) time += '0';
        time += `${i / 2}:00`;
      } else {
        if (i < 20) time += '0';
        time += `${(i - 1) / 2}:30`;
      }
      this.options.data[i] = time;
    }
  },
};
</script>
<style lang="sass">
.flight-section-number
  font-weight: bold
  padding: 30% 0 0 30%

.flight-request-form
  background-color: aliceblue

.flight-info
  border-bottom: 1px solid #ccc
  &:last-child
    border-bottom: none

.filter-option
  padding-bottom: 2rem
  &:last-child
      padding-bottom: 0

.traveltimes-slider
  padding: 0rem 0 2.5rem 0 !important

.flight-route-result
  margin-bottom: 2rem !important
  border: 1px solid #ccc
  border-radius: 5px

.is-vertical-centered
  display: flex
  align-items: center
  justify-content: center

.flight-start, .flight-end, .flight-hr
  display: inline-block

.flight-hr
  padding: 0 1rem

.is-vertically-stacked
  flex-direction: column

.flight-route-price
  font-size: 2rem
  font-weight: bold

</style>
