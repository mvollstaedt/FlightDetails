<template lang="pug">
  .home
    .hero.is-primary
      .hero-body
        .container
          h1.title Flugsuche
            |
            i.fas.fa-plane
            span.is-pulled-right(style="font-size: 1.8rem;")
              i.far.fa-bell
          h2.subtitle Finde den passenden Flug
    section.flight-request-form.section#main
      .container
        .columns.is-variable.is-2.is-mobile.has-text-left(v-for="(flight, index) in inputFlightRoute")
          .column.is-1.is-relative
            .flight-no(:class="'flight-no-' + index")
              | {{ index + 1 }}
          .column
            b-field(:label="index === 0 ? 'From' : ''")
              b-autocomplete(
                rounded
                @input="onInputAutocomplete(flight.startLocation.input)"
                v-model="flight.startLocation.input"
                :data="filteredFlightDestinations"
                placeholder="Start Destination"
                @select="option => onSelectLocation(flight.startLocation, option)"
                class="input-location"
                :id="'input-from-' + index")
                template(slot="empty") No results found
          .column
            b-field(:label="index === 0 ? 'To' : ''")
              b-autocomplete(
              rounded
              @input="onInputAutocomplete(flight.endLocation.input)"
              v-model="flight.endLocation.input"
              :data="filteredFlightDestinations"
              placeholder="End Destination"
              @select="option => onSelectLocation(flight.endLocation, option)"
              class="input-location")
                template(slot="empty") No results found
          .column
            b-field(:label="index === 0 ? 'When' : ''")
              b-datepicker(
                rounded
                placeholder="Click to select..."
                :min-date="minDate"
                :max-date="maxDate"
                v-model="flight.travelDate")
        .columns.is-mobile
          .column
            button.button.is-medium.is-success.is-outlined.is-pulled-right(v-if="isPhoneSize || isTabletSize" @click="onClickFilter")
              | Filter
          .column.is-narrow
            button.button.is-medium.is-success.is-pulled-right(@click="searchFlightRoutes")
              | Suchen

    .container
      .columns
        aside.section.menu.filter-options.column.is-3.has-text-left(v-show="!isTabletSize && !isPhoneSize" :class="!isTabletSize && !isPhoneSize ? 'is-desktop' : 'is-mobile'")
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
              v-bind:label="searchedFlightRoute[index].startLocation.city + ' (' + searchedFlightRoute[index].startLocation.iata + ')' +' - ' + searchedFlightRoute[index].endLocation.city + ' (' + searchedFlightRoute[index].endLocation.iata + ')'")
                vue-slider(ref="slider" v-model="filters.travelTimes[index]" v-bind="options" class="traveltimes-slider")

        section.flight-route-results.section.column.is-offset-1-desktop(v-if="filteredFlightRouteList.length" :class="!isTabletSize && !isPhoneSize ? 'is-desktop' : 'is-mobile'")
          paginate(v-if="filteredFlightRouteList !== []" name="filteredFlightRouteList", :list="filteredFlightRouteList", class="paginate-list", tag="div")
            .columns.flight-route-result.has-box-shadow(v-for="flightRouteResult in paginated('filteredFlightRouteList')")
              .column.is-9
                .column
                  .columns.is-mobile.flight-info.is-vh-centered(v-for="flight in flightRouteResult.flights")
                    .column.is-2
                      .placeholder-logo(:class="isTabletSize || isPhoneSize ? 'is-mobile' : ''")
                    .column.is-7-desktop.is-relative
                      p.flight-duration {{ flight.travelTime + ' min' }}
                      .is-vh-centered
                        .flight-start
                          .flight-location {{ flight.startLocation.city + ' (' + flight.startLocation.iata + ')'}}
                          .flight-time {{ flight.startTime }}
                        i.flight-hr.fas.fa-plane
                        .flight-end
                          .flight-location {{ flight.endLocation.city + ' (' + flight.endLocation.iata + ')'}}
                          .flight-time {{ flight.endTime }}
              .column.is-3.is-vh-centered.is-vertically-stacked.flight-route-results__cta(:class="isPhoneSize ? 'is-mobile' : 'is-desktop'")
                .flight-route-price {{ flightRouteResult.price | currency}}
                button.button.is-medium.is-primary(@click="openFlightRouteDetailsModal(flightRouteResult)") Details
          paginate-links(for="filteredFlightRouteList" :async="true")
        section.flight-route-results.section.column.is-offset-1-desktop(v-else)
          .column
            | Keine Suchergebnisse gefunden

    b-modal(:active.sync="isFlightModalActive")
      .modal-background
      .modal-card
        header.modal-card-head
          p.modal-card-title Flugrouten Details
        section.modal-card-body
          .trip-section
            section.trip-section-content
              .columns
                .column
                  .columns.is-mobile.flight-segment-info.is-vertical-centered.is-multiline(v-for="(flight, index) in flightRouteModalData.flights")
                    .column.is-2
                      .placeholder-logo(:class="isTabletSize || isPhoneSize ? 'is-mobile' : ''")
                    .column.is-relative.is-10
                      p.flight-duration {{ flight.travelTime + ' min' }}
                      .is-vh-centered
                        .flight-start
                          .flight-location {{ flight.startLocation.city }}
                          .flight-time {{ flight.startTime }}
                        i.flight-hr.fas.fa-plane
                        .flight-end
                          .flight-location {{ flight.endLocation.city }}
                          .flight-time {{ flight.endTime }}
                    .column.is-offset-1.is-10(v-if="index < flightRouteModalData.flights.length - 1")
                      .trip-section-waiting-time {{ 'Aufenthaltsdauer: ' + getTimeOfStay(flightRouteModalData.flights, index) + ' Tage' }}
        footer.modal-card-foot.is-horizontal-centered
          button.button.is-primary(@click="$router.push({ name: 'booking', params: { flightRouteData: flightRouteModalData} })") Buchen

    aside.nav-drawer-container.has-text-left(v-show="isPhoneSize || isTabletSize" :class="isFilterDrawerActive ? 'is-active' : ''")
      .filter-drawer
        .filter-drawer-header
          h3.filter-drawer-title
            | Filter
          button.button.is-outlined.filter-drawer-btn-close(@click="isFilterDrawerActive = false") Fertig
        .filter-drawer-content
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
              v-bind:label="searchedFlightRoute[index].startLocation.city + ' (' + searchedFlightRoute[index].startLocation.iata + ')' +' - ' + searchedFlightRoute[index].endLocation.city + ' (' + searchedFlightRoute[index].endLocation.iata + ')'")
                vue-slider(ref="slider" v-model="filters.travelTimes[index]" v-bind="options" class="traveltimes-slider", :show="drawerAnimFinished")

</template>

<script>
/* eslint-disable */
// @ is an alias to /src
import BField from 'buefy/src/components/field/Field.vue';
import BAutocomplete from 'buefy/src/components/autocomplete/Autocomplete.vue';
import BDatepicker from 'buefy/src/components/datepicker/Datepicker.vue';
import VueSlider from 'vue-slider-component';
import moment from 'moment';

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

      paginate: ['filteredFlightRouteList'],

      autocompleteActive: false,

      SIZE_PHONE: 768,
      SIZE_TABLET: 1024,
      isTabletSize: false,
      isPhoneSize: false,

      minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      maxDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 365),

      options: {
        data: [],
        tooltipDir: 'bottom',
      },

      flightDestinations: [],

      filteredFlightDestinations: [],

      flightRouteResults: [],

      // flight route which was searched for
      searchedFlightRoute: [],
      // flight route which is input in the form
      inputFlightRoute: [],

      flightRouteModalData: {},

      filters: {
        stopovers: ['0'],
        travelTimes: [
          ['00:00', '23:59'],
          ['00:00', '23:59'],
          ['00:00', '23:59'],
        ],
      },


      isFlightModalActive: false,
      isFilterDrawerActive: false,

      drawerAnimFinished: false,

      tripSections: {},
    };
  },
  methods: {

    onClickFilter() {
      this.isFilterDrawerActive = true;
      var self = this;
      setTimeout(function() {
        self.drawerAnimFinished = true;
      }, 400);
    },

    openFlightRouteDetailsModal(flightRouteResult) {
      this.flightRouteModalData = flightRouteResult;
      this.isFlightModalActive = true;
      console.log(flightRouteResult.toString())
    },

    getTimeOfStay(flights, index) {
      if (flights[index + 1] === undefined) return 0;

      let start = moment(flights[index].travelDate);
      let end = moment(flights[index + 1].travelDate);

      return Math.round(moment.duration(end.diff(start)).asDays());
    },

    onInputAutocomplete(input) {
        this.filteredFlightDestinations = this.flightDestinationStrings.filter(option => option
        .toString()
        .toLowerCase()
        .indexOf(input.toLowerCase()) >= 0);
    },

    // update input data structure
    onSelectLocation(locationObj, option) {
      // must be adapted if displayed string changes
      let iataStr = '';
      let optionSplit = option.split('(');
      if (optionSplit.length > 1) {
        iataStr = optionSplit[1].split(')')[0].trim();
      }
      var cityStr = optionSplit[0].trim();


      locationObj.input = option;
      locationObj.city = cityStr;
      locationObj.iata = iataStr;
    },

    onUpdateTripSections(tripSectionsData) {
      this.tripSections = tripSectionsData;
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

    saveFlight(event) {
      this.isFlightModalActive = false;
      this.$toast.open("Flug wurde gespeichert.");
      // TODO: send data to other comps
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
    },

    searchFlightRoutes() {
      // so that in filter section flight infos get synced
      this.searchedFlightRoute = this.inputFlightRoute.slice();

      // retrieve JSON data
      let resultData = JSON.parse(Helpers.queryFlightRoutes(this.searchedFlightRoute));

      // save data in js class implementation for consistency
      let flightRouteResultsTmp = [];

      for (const result of resultData){
        let flightRouteTmp = new FlightRoute();
        flightRouteTmp.price = result.price;

        for (const flight of result.flights) {
          let flightTmp = new Flight(flight.startTime, flight.endTime, flight.flightNo, flight.airline);
          flightTmp.travelTime = flight.travelTime;
          flightTmp.travelDate = flight.travelDate;

          let flightSegmentTmp = new FlightSegment(flight.startTime, flight.startLocation, flight.endTime, flight.endLocation);
          flightTmp.addFlightSegment(flightSegmentTmp);

          flightRouteTmp.addFlight(flightTmp);
        }

        flightRouteResultsTmp.push(flightRouteTmp);
      }

      this.flightRouteResults = flightRouteResultsTmp;
    }
  },
  computed: {

    flightDestinationStrings() {
        return this.flightDestinations.map(location => {
          var displayName = location.city;
          if (location.iata !== "\\N")
            displayName += " (" + location.iata + ")";
          return displayName
        });
    },

    filteredFlightRouteList() {

      // if stopovers are changing
      let filteredList = this.flightRouteResults.filter((flightRouteResult) => {
        for (var flight of flightRouteResult.flights) {
          if (this.filters.stopovers.some(val => val === flight.stopoverCount.toString())) {
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
          if (this.timeInTimespan(flight.startDate, this.filters.travelTimes[i])
              && this.timeInTimespan(flight.endDate, this.filters.travelTimes[i])) {
            i += 1;
            continue;
          }
          return false;
        }
        return true;
      });

      return filteredList;
    },

    filteredFlightRouteListEmpty() {
      return this.filteredFlightRouteList === [];
    }
  },

  filters: {
    currency: (val) => {
      return val + ' €';
    },
  },

  created() {

    this.flightDestinations = Helpers.getAirportList();

    this.searchedFlightRoute = Helpers.getCurrentFlightRouteDummy();
    this.inputFlightRoute = this.searchedFlightRoute.slice();

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
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  }
};
</script>
<style lang="sass">
#nav
  padding: 30px
  a
    font-weight: bold
    color: #2c3e50
    &.router-link-exact-active
      color: #42b983

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

.has-box-shadow
  box-shadow: 0px 9px 33px -9px rgba(0,0,0,0.75)

.flight-route-results__cta
  &.is-mobile
    border-top: 5px dashed #d2dae2
  &.is-desktop
    border-left: 5px dashed #d2dae2

.is-vh-centered
  display: flex
  align-items: center
  justify-content: center

.is-vertical-centered
  display: flex
  align-items: center

.is-horizontal-centered
  display: flex
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

.filter-options
  &.is-desktop

.trip-section-title
  text-align: left
  font-weight: bold

.trip-section-waiting-time
  font-weight: bold
  background-color: rgb(232, 240, 246)
  border-radius: 10px

@media screen and (min-width: 1024px)
  .modal-card, .modal-content
    width: 800px

body.no-scrolling
  overflow-x: hidden
  overflow-y: scroll !important

.nav-drawer-container
  position: absolute
  height: 100%
  width: 100%
  background-color: aliceblue
  z-index: 10000
  top: 0
  left: -100%
  transition: .4s ease
  position: fixed
  overflow: hidden
  &.is-active
    left: 0

.nav-drawer-container
  padding: 2rem

.filter-drawer
  max-width: 600px
  margin: 0 auto

.filter-drawer-header
  padding-bottom: 1rem
  position: relative

.filter-drawer-title
  font-weight: bold
  font-size: 1.7rem
  text-align: center

.filter-drawer-btn-close
  position: absolute
  top: 0
  right: 0
  background-color: transparent

.paginate-links .left-arrow,
.paginate-links .right-arrow
  display: inline-flex
  a
    padding: .5rem 1rem

.paginate-links .right-arrow
  margin-left: -1.25rem

</style>
