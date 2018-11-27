<template lang="pug">
  .home
    section.flight-request-form.section#main
      .container
        .columns.is-variable.is-2.is-mobile.has-text-left(v-for="(flight, index) in currentFlightRoute")
          .column.is-1.is-relative
            .flight-no(:class="'flight-no-' + index")
              | {{ index + 1 }}
          .column
            b-field(:label="index === 0 ? 'From' : ''")
              b-autocomplete(
                rounded
                @input="onInputAutocomplete(flight.startLocation)"
                v-model="flight.startLocation"
                :data="filteredFlightDestinations"
                placeholder="Start Destination"
                @select="option => flight.startLocation = option")
                template(slot="empty")
                No results found
          .column
            b-field(:label="index === 0 ? 'To' : ''")
              b-autocomplete(
              rounded
              @input="onInputAutocomplete(flight.endLocation)"
              v-model="flight.endLocation"
              :data="filteredFlightDestinations"
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
      aside.section.menu.filter-options.column.is-4.has-text-left(v-if="!isTabletSize && !isPhoneSize")
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
            b-field(v-for="(travelTime, index) in filters.travelTimes" :key="index"
            v-bind:label="currentFlightRoute[index].startLocation + ' - ' + currentFlightRoute[index].endLocation")
              vue-slider(ref="slider" v-model="filters.travelTimes[index]", v-bind="options", class="traveltimes-slider")

      section.flight-route-results.section.column
        .columns.flight-route-result(v-for="flightRouteResult in filteredFlightRouteList")
            .column.is-9
              .column
                .columns.is-mobile.flight-info.is-vertical-centered(v-for="flight in flightRouteResult.flights")
                  .column.is-2
                    .placeholder-logo(:class="isTabletSize || isPhoneSize ? 'is-mobile' : ''")
                  .column.is-7-desktop.is-relative
                    p.flight-duration {{ flight.travelTime + ' min' }}
                    .is-vertical-centered
                      .flight-start
                        .flight-location {{ flight.startLocation }}
                        .flight-time {{ flight.startTime }}
                      i.flight-hr.fas.fa-plane
                      .flight-end
                        .flight-location {{ flight.endLocation }}
                        .flight-time {{ flight.endTime }}
            .column.is-3.is-vertical-centered.is-vertically-stacked
                .flight-route-price {{ flightRouteResult.price }}
                button.button.is-medium.is-primary(@click="pinFlight(flightRouteResult)") Check Out


</template>

<script>
/* eslint-disable */
// @ is an alias to /src
import BField from 'buefy/src/components/field/Field.vue';
import BAutocomplete from 'buefy/src/components/autocomplete/Autocomplete.vue';
import BDatepicker from 'buefy/src/components/datepicker/Datepicker.vue';
import VueSlider from 'vue-slider-component';

import { Flight, FlightRoute, FlightSegment } from '../lib/model';
import * as Helpers from '../lib/helpers';

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
      name: '',

      SIZE_PHONE: 768,
      SIZE_TABLET: 1024,
      isTabletSize: false,
      isPhoneSize: false,

      date: new Date(),
      minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      maxDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 365),

      value: ['00:00', '23:59'],
      options: {
        data: [],
        tooltipDir: 'bottom',
      },

      flightDestinations: [],

      filteredFlightDestinations: [],

      flightRouteResults: [],

      destInputSelected: [],
      startLocation: null,
      endLocation: null,
      currentFlightRoute: [],

      filters: {
        stopovers: ['0'],
        travelTimes: [
          ['00:00', '23:59'],
          ['00:00', '23:59'],
          ['00:00', '23:59'],
        ],
      },

      currentTrip: [],
    };
  },
  methods: {
    onInputAutocomplete(input) {
        this.filteredFlightDestinations = this.flightDestinationStrings.filter(option => option
        .toString()
        .toLowerCase()
        .indexOf(input.toLowerCase()) >= 0);
    },

    pinFlight(flightRouteResult) {
      let flightRouteToPin = flightRouteResult;

      for (const flightRoute of this.flightRouteResults) {
        flightRoute.pinned = false;
      }

      if (flightRouteToPin.pinned) {
        this.$toast.open('Flight Route was unpinned.');
        flightRouteToPin.pinned = false;
      } else {
        this.$toast.open('Flight Route was pinned.');
        flightRouteToPin.pinned = true;
      }

      flightRouteResult = flightRouteToPin
    },

    // check if time is in certain time range
    timeInTimespan(time, timespan) {
      const timespanTemp = [timespan[0].split(':'), timespan[1].split(':')];
      const timeTemp = time.split(':');

      const startDate = new Date(2012, 10, 2, parseInt(timespanTemp[0][0], 10), parseInt(timespanTemp[0][1]), 10);
      const endDate = new Date(2012, 10, 2, parseInt(timespanTemp[1][0], 10), parseInt(timespanTemp[1][1]), 10);
      const travelDate = new Date(2012, 10, 2, parseInt(timeTemp[0], 10), parseInt(timeTemp[1]), 10);

      return startDate <= travelDate && endDate >= travelDate;
    },

    // update flight route if other comp is changing it
    updateFlightRoute(flightRoute) {
      // TODO
    },

    onResize(event) {
      // is tablet size
      if(event.target.innerWidth <= this.SIZE_TABLET && event.target.innerWidth > this.SIZE_PHONE) {
        this.isTabletSize = true;
        this.isPhoneSize = false;
      }
      // is phone size
      else if (event.target.innerWidth <= this.SIZE_PHONE) {
        this.isTabletSize = false;
        this.isPhoneSize = true;
      }
      // is desktop size
      else {
        this.isPhoneSize = false;
        this.isTabletSize = false;
      }
    }
  },
  computed: {

    flightDestinationStrings() {
      return this.flightDestinations.map(location => location.city + " (" + location.id + ")");
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
        let i = 0;
        for (const flight of flightRouteResult.flights) {
          if (this.timeInTimespan(flight.startTime, this.filters.travelTimes[i])
              && this.timeInTimespan(flight.endTime, this.filters.travelTimes[i])) {
            i += 1;
            continue;
          }
          return false;
        }
        return true;
      });

      return filteredList;
    },
  },
  created() {

    // fill in dummy data
    this.currentFlightRoute = Helpers.getCurrentFlightRouteDummy();
    this.flightRouteResults = Helpers.getFlightRouteDummyData();
    this.flightDestinations = Helpers.getDestinationList();

  },
  mounted() {

    // register event listeners for resize event
    window.addEventListener('resize', this.onResize);
    window.dispatchEvent(new Event('resize'));

    // fill hours for travel time slider options
    for (let i = 0; i < 49; i += 1) {
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

    let i = 0;
    for (var flight in this.currentFlightRoute) {
      let flightInput = {
        start: false,
        end: false
      };
      this.destInputSelected[i] = flightInput;
      i += 1;
    }
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  }
};
</script>
<style lang="sass">
.flight-no
  position: absolute
  text-align: center
  bottom: 25%
  width: 30px
  height: 30px
  border-radius: 50%
  line-height: 30px
  font-size: .9rem
  border: 1px solid #ccc
  right: 0

.flight-start, .flight-end
  min-width: 40%

.flight-time
  font-size: .8rem

.flight-duration
  font-size: .8rem
  position: absolute
  left: 0
  right: 0
  margin-left: auto
  margin-right: auto
  top: 5px


.flight-no-0
  bottom: 15%

.flight-request-form
  background-color: aliceblue

.flight-info
  border-bottom: 1px solid #d9d9d9
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
  border-radius: 5px
  box-shadow: 0px 9px 33px -9px rgba(0,0,0,0.75)

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

.is-relative
  position: relative

.placeholder-logo
  width: 70px
  height: 70px
  background-color: #ffb5d8
  &.is-mobile
    width: 50px
    height: 50px

</style>
