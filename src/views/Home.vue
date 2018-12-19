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
        aside.section.menu.filter-options.column.is-3.has-text-left(v-if="searchedFlightRoute.length > 0 && (!isTabletSize && !isPhoneSize)" :class="!isTabletSize && !isPhoneSize ? 'is-desktop' : 'is-mobile'")
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
              v-bind:label="searchedFlightRoute[index].startLocation.city + ' - ' + searchedFlightRoute[index].endLocation.city")
                vue-slider(ref="slider" v-model="filters.travelTimes[index]" v-bind="options" class="traveltimes-slider")

        section.flight-route-results.section.column.is-offset-1-desktop(v-if="filteredFlightRouteList.length" :class="!isTabletSize && !isPhoneSize ? 'is-desktop' : 'is-mobile'")
          paginate(v-if="filteredFlightRouteList !== []" name="filteredFlightRouteList", :list="filteredFlightRouteList", class="paginate-list", tag="div", :refreshCurrentPage="false")
            .columns.flight-route-result.has-box-shadow(v-for="flightRouteResult in paginated('filteredFlightRouteList')")
              .column.is-9
                .column
                  .columns.is-mobile.flight-info.is-vh-centered(v-for="flight in flightRouteResult.flights")
                    .column.is-3
                      .airline-logo.airline-logo-overview(:class="isTabletSize || isPhoneSize ? 'is-mobile' : ''") {{ flight.airline.callsign }}
                    .column.is-7-desktop.is-relative
                      p.flight-duration {{ flight.travelTime + ' min' }}
                      .is-vh-centered
                        .flight-start
                          .flight-location {{ flight.startLocation.city + ' (' + flight.startLocation.iata + ')'}}
                          .flight-time {{ flight.startDate }}
                        i.flight-hr.fas.fa-plane
                        .flight-end
                          .flight-location {{ flight.endLocation.city + ' (' + flight.endLocation.iata + ')'}}
                          .flight-time {{ flight.endDate }}
                            sup(v-if="!isSameDay(flight.startDate, flight.travelTime, flight.travelDate)") +1
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
                    .column.is-12.has-text-left
                      .flight-date {{ flight.travelDate | momentjs('DD.MM.YYYY') }}
                    .column.is-3.has-text-left
                      .airline-logo.airline-logo-overview(:class="isTabletSize || isPhoneSize ? 'is-mobile' : ''") {{ flight.airline.callsign }}
                    .column.is-relative.is-9
                      p.flight-duration {{ flight.travelTime + ' min' }}
                      .is-vh-centered
                        .flight-start
                          .flight-location {{ flight.startLocation.city }}
                          .flight-time {{ flight.startDate }}
                        i.flight-hr.fas.fa-plane
                        .flight-end
                          .flight-location {{ flight.endLocation.city }}
                          .flight-time {{ flight.endDate }}
                    .column.is-offset-1.is-10(v-if="index < flightRouteModalData.flights.length - 1")
                      .trip-section-waiting-time {{ 'Aufenthaltsdauer: ' + getTimeOfStay(flightRouteModalData.flights, index) + ' Tage' }}
        footer.modal-card-foot.is-horizontal-centered
          button.button.is-primary(@click="onOpenBookingWizard(flightRouteModalData)")
            | Buchen für {{ flightRouteModalData.price | currency }}


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
import { isEmpty } from '../lib/helpers';

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

      // used as default start/end location of the trip
      defaultGermanAirport: {
        city: "Berlin",
        iata: "SXF",
        input: "Berlin (SXF)"
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
        travelTimes: [],
      },


      isFlightModalActive: false,
      isFilterDrawerActive: false,

      drawerAnimFinished: false,

      tripSections: {},
    };
  },
  methods: {

    onOpenBookingWizard(flightRouteData) {
      var self = this;
      this.$router.push({ name: 'booking', params: { flightRouteData, tripSectionsData: self.tripSectionsData } })
    },

    isSameDay(startTimeStr, travelTime, travelDateStr) {
      let startTimeMoment = moment(startTimeStr, 'hh:mm A');
      let travelDate = new Date(travelDateStr);
      let endDateMoment;

      let startDateMoment = moment({ years: travelDate.getFullYear(), months: travelDate.getMonth(), days: travelDate.getDay(), hours: startTimeMoment.hours(), minutes: startTimeMoment.minutes()});
      endDateMoment = moment(startDateMoment).add(travelTime, 'minutes');
      return startDateMoment.isSame(endDateMoment, 'days');
    },

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

    // update ui with newly retrieved trip sections data
    onUpdateTripSections(tripSectionsData) {
      let searchSection;
      this.tripSections = tripSectionsData;
      var self = this;

      let searchData = [];

      var i = 0;

      // update flight input mask data
      for (const tripSection of tripSectionsData.sections) {

        switch(i) {
          case 0:
            let exampleIata = "";
            this.flightDestinations.find(location => {
              if(location.city === tripSection.location.name) {
                exampleIata = location.iata;
                return true;
              }
            });

            searchSection = {
              startLocation: {
                ...this.defaultGermanAirport
              },
              endLocation: {
                city: tripSection.location.name,
                iata: exampleIata,
                input: self.getDisplayedInputDstStr(tripSection.location.name, exampleIata)
              },
              travelDate: tripSection.startDate
            };

            break;
          default:
            let exampleIataEnd = "";
            this.flightDestinations.find(location => {
              if(location.city === tripSection.location.name) {
                exampleIataEnd = location.iata;
                return true;
              }
            });

            searchSection = {
              startLocation: {
                city: tripSectionsData.sections[i - 1].location.name,
                iata: searchData[searchData.length - 1].endLocation.iata,
                input: searchData[searchData.length - 1].endLocation.input
              },
              endLocation: {
                city: tripSection.location.name,
                iata: exampleIataEnd,
                input: self.getDisplayedInputDstStr(tripSection.location.name, exampleIataEnd)
              },
              travelDate: tripSection.startDate
            };
            break;
        }
        searchData.push(searchSection);
        i++;
      }

      searchSection = {
        startLocation: {
          city: tripSectionsData.sections[tripSectionsData.sections.length - 1].location.name,
          iata: searchData[searchData.length - 1].endLocation.iata,
          input: searchData[searchData.length - 1].endLocation.input,
        },
        endLocation: {
          ...this.defaultGermanAirport
        },
        travelDate: tripSectionsData.endDate,
      };

      searchData.push(searchSection);

      this.updateFilterData(searchData);
      this.inputFlightRoute = searchData;
      this.searchFlightRoutes();

      this.$toast.open({
        message: 'Flights were updated due to changes in another component',
        type: 'is-warning',
        duration: 4000
      })
    },

    updateFilterData(searchData) {
      let travelTimes = [];
      let travelTime = ["00:00", "23:59"];
      for (var i = 0; i < searchData.length; i++) {
        travelTimes.push(travelTime);
      }
      this.filters.travelTimes = travelTimes;
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

    getDisplayedInputDstStr(city, iata) {
      if (iata === "") {
        return city;
      }
      return `${city} (${iata})`;
    },

    searchFlightRoutes() {
      var self = this;

      // to prevent input errors
      for (var inputRow of this.inputFlightRoute) {
        inputRow.startLocation.input = self.getDisplayedInputDstStr(inputRow.startLocation.city, inputRow.startLocation.iata);
        inputRow.endLocation.input = self.getDisplayedInputDstStr(inputRow.endLocation.city, inputRow.endLocation.iata);
      }

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
          if (location.iata !== "")
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
    momentjs: (val, format) => {
      return moment(val).format(format);
    }
  },

  created() {

    this.flightDestinations = Helpers.getAirportList();

    this.onUpdateTripSections(Helpers.getTripSectionsInitialData())
    //this.onUpdateTripSections(Helpers.getTripSectionsDataDummy())
    //this.searchedFlightRoute = Helpers.getCurrentFlightRouteDummy();
    //this.inputFlightRoute = this.searchedFlightRoute.slice();

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

.airline-logo
  background-color: #d0ffcf
  padding: .5rem .7rem
  word-break: break-word
  font-weight: bold
  display: inline-block

.airline-logo-overview
  font-size: .5rem
  text-transform: none
  line-height: .8rem

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
