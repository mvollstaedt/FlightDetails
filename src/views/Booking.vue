<template lang="pug">
  .booking
    .hero.is-primary
      .hero-body
        .container.is-fluid.has-text-centered
          a.button.is-pulled-left.is-transparent.btn-back(@click="onUserCancelBooking")
            span(style="font-size: 1.8rem;")
              i.fas.fa-chevron-left
          h1.title Booking
            |
            i.fas.fa-clipboard.title-icon
          h2.subtitle Only a few steps left
    .form-wizard
      form-wizard(title="", subtitle="", stepSize="xs", color="#7957d5", errorColor="#ff3860", finishButtonText="Complete Booking", ref="wizard")
        tab-content(title='Options' :before-change="() => validateStep('options')")
          section.section.trip-section-content(v-if="!isEmpty(flightRouteData)")
            .container
              .title.has-text-left Flight Data
              .trip-section-wrapper.has-box-shadow
                .columns
                  .column
                    .columns.is-mobile.flight-segment-info.is-vertical-centered.is-multiline(v-for="(flight, index) in flightRouteData.flights")
                      .column.is-2
                        .airline-logo.airline-logo-overview(:class="isTabletSize || isPhoneSize ? 'is-mobile' : ''") {{ flight.airline.callsign }}
                      .column.is-relative.is-10
                        p.flight-duration {{ flight.travelTime + ' min' }}
                        .is-vh-centered
                          .flight-start
                            .flight-location {{ getDisplayedInputDstStr(flight.startLocation.city, flight.startLocation.iata) }}
                            .flight-time {{ flight.startDate | momentjs('DD.MM.YY - HH:mm') }}
                          i.flight-hr.fas.fa-plane
                          .flight-end
                            .flight-location {{ getDisplayedInputDstStr(flight.endLocation.city, flight.endLocation.iata)  }}
                            .flight-time {{ flight.endDate | momentjs('DD.MM.YY - HH:mm') }}
                      .column.is-offset-1.is-10(v-if="index < flightRouteData.flights.length - 1")
                        .trip-section-waiting-time {{ 'Aufenthaltsdauer: ' + getTimeOfStay(flightRouteData.flights, index) + ' Tage' }}
          section.section.further-options-content
            .container
              .title.has-text-left Further Options
              b-field( horizontal label="Luggage Option")
                b-select(v-model="model.options.luggageOption")
                  option(v-for="option in luggageOptions", :value="option.id", :key="option.id") {{ option.id }}
              b-field( horizontal label="Seat Reservation", class="has-text-left")
                b-switch(v-model="model.options.seatReservation")

        tab-content(title='Personal Details', :before-change="() => validateStep('personalDetails')")
          .section.has-text-left
            .container
              .title Personal Details
              .field.is-horizontal
                .field-label.is-normal
                  label.label Name
                .field-body
                  .field
                    p.control.is-expanded.has-icons-right
                      input.input(type="text" placeholder="Last Name", v-model.trim="model.personalDetails.lastName", @input="$v.model.personalDetails.lastName.$touch()", :class="{'is-danger': $v.model.personalDetails.lastName.$error}")
                      span.icon.is-small.is-right(v-if="$v.model.personalDetails.lastName.$error")
                        i.fas.fa-exclamation-triangle
                    p.help.is-danger(v-if="$v.model.personalDetails.lastName.$error") The last name is invalid
                  .field
                    p.control.is-expanded.has-icons-right
                      input.input(type="text" placeholder="First Name", v-model.trim="model.personalDetails.firstName", @input="$v.model.personalDetails.firstName.$touch()", :class="{'is-danger': $v.model.personalDetails.firstName.$error}")
                      span.icon.is-small.is-right(v-if="$v.model.personalDetails.firstName.$error")
                        i.fas.fa-exclamation-triangle
                    p.help.is-danger(v-if="$v.model.personalDetails.firstName.$error") The first name is invalid
              .field.is-horizontal
                .field-label.is-normal
                  label.label Tel
                .field-body
                  .field
                    p.control.is-expanded.has-icons-right
                      input.input(type="tel" placeholder="(+49) 12345678", v-model.trim="model.personalDetails.tel", @input="$v.model.personalDetails.tel.$touch()", :class="{'is-danger': $v.model.personalDetails.tel.$error}")
                      span.icon.is-small.is-right(v-if="$v.model.personalDetails.tel.$error")
                        i.fas.fa-exclamation-triangle
                    p.help.is-danger(v-if="$v.model.personalDetails.tel.$error") The telephone number is invalid
              .field.is-horizontal
                .field-label.is-normal
                  label.label Date of Birth
                .field-body
                  .field
                    p.control.is-expanded.has-icons-right
                      input.input(type="date" placeholder="2018-01-01", min="1940-01-01", max="2000-01-01", v-model.trim="model.personalDetails.birthdate", @input="$v.model.personalDetails.birthdate.$touch()", @change="$v.model.personalDetails.birthdate.$touch()", :class="{'is-danger': $v.model.personalDetails.birthdate.$error}")
                      span.icon.is-small.is-right(v-if="$v.model.personalDetails.birthdate.$error")
                        i.fas.fa-exclamation-triangle
                    p.help.is-danger(v-if="$v.model.personalDetails.birthdate.$error") The birthdate is invalid
              .field.is-horizontal
                .field-label.is-normal
                  label.label Email
                .field-body
                  .field
                    p.control.is-expanded.has-icons-right
                      input.input(type="email" placeholder="max.muster@gmx.de", v-model.trim="model.personalDetails.email", @input="$v.model.personalDetails.email.$touch()", :class="{'is-danger': $v.model.personalDetails.email.$error}")
                      span.icon.is-small.is-right(v-if="$v.model.personalDetails.email.$error")
                        i.fas.fa-exclamation-triangle
                    p.help.is-danger(v-if="$v.model.personalDetails.email.$error") The email address is invalid
        tab-content(title='Payment Details')
          .section.has-text-left
            .container
              .title Payment Details
              b-notification
                | At this moment, only credit card is accepted as payment method. We apologize for any inconvenience.
              .field.is-horizontal
                .field-label.is-normal
                  label.label Name of Cardholder
                .field-body
                  .field
                    p.control.is-expanded.has-icons-right
                      input.input(type="text" placeholder="Last Name", v-model.trim="model.paymentDetails.lastName", @input="$v.model.paymentDetails.lastName.$touch()", :class="{'is-danger': $v.model.paymentDetails.lastName.$error}")
                      span.icon.is-small.is-right(v-if="$v.model.paymentDetails.lastName.$error")
                        i.fas.fa-exclamation-triangle
                    p.help.is-danger(v-if="$v.model.paymentDetails.lastName.$error") The last name is invalid
                  .field
                    p.control.is-expanded.has-icons-right
                      input.input(type="text" placeholder="First Name", v-model.trim="model.paymentDetails.firstName", @input="$v.model.paymentDetails.firstName.$touch()", :class="{'is-danger': $v.model.paymentDetails.firstName.$error}")
                      span.icon.is-small.is-right(v-if="$v.model.paymentDetails.firstName.$error")
                        i.fas.fa-exclamation-triangle
                    p.help.is-danger(v-if="$v.model.paymentDetails.firstName.$error") The first name is invalid
              .field.is-horizontal
                .field-label.is-normal
                  label.label Card Number
                .field-body
                  .field
                    p.control.is-expanded.has-icons-right
                      input.input(type="number" placeholder="0123456789", v-model.trim="model.paymentDetails.cardNumber", @input="$v.model.paymentDetails.cardNumber.$touch()", :class="{'is-danger': $v.model.paymentDetails.cardNumber.$error}")
                      span.icon.is-small.is-right(v-if="$v.model.paymentDetails.cardNumber.$error")
                        i.fas.fa-exclamation-triangle
                    p.help.is-danger(v-if="$v.model.paymentDetails.cardNumber.$error") The card number is invalid
              .field.is-horizontal
                .field-label.is-normal
                  label.label Date of Expiry
                .field-body
                  .field
                    p.control.is-expanded.has-icons-right
                      input.input(type="text" placeholder="03/18", v-model.trim="model.paymentDetails.expirationDate", @input="$v.model.paymentDetails.expirationDate.$touch()", :class="{'is-danger': $v.model.paymentDetails.expirationDate.$error}")
                      span.icon.is-small.is-right(v-if="$v.model.paymentDetails.expirationDate.$error")
                        i.fas.fa-exclamation-triangle
                    p.help.is-danger(v-if="$v.model.paymentDetails.expirationDate.$error") The expiration date is invalid
              .field.is-horizontal
                .field-label.is-normal
                  label.label Security Code
                .field-body
                  .field
                    p.control.is-expanded.has-icons-right.security-code-input
                      input.input(type="number" placeholder="123", v-model.trim="model.paymentDetails.securityCode", @input="$v.model.paymentDetails.securityCode.$touch()", :class="{ 'is-danger': $v.model.paymentDetails.securityCode.$error}")
                      span.icon.is-small.is-right(v-if="$v.model.paymentDetails.securityCode.$error")
                        i.fas.fa-exclamation-triangle
                    p.help.is-danger(v-if="$v.model.paymentDetails.securityCode.$error") The security code is invalid
        tab-content(title='Final Step')
          section.section
            .container.has-text-left
              .title Flight Details
              .final-step__flight(v-for="flight in flightRouteData.flights")
                h3 {{ moment(flight.travelDate).format('DD.MM.YY') }}
                p {{ getDisplayedInputDstStr(flight.startLocation.city, flight.startLocation.iata) }}
                  span.fas.fa-plane.final-step__plane-icon
                  | {{ getDisplayedInputDstStr(flight.endLocation.city, flight.endLocation.iata) }}
          section.section
            .container.has-text-left
              .title Personal Details
              .final-step__personal-details(v-for="(val, key) in model.personalDetails")
                .columns.is-mobile
                  p.column.is-5-mobile.is-2-tablet
                    b {{ key | splitWords }}
                  p.column.is-6-mobile
                    | {{ val }}
          section.section
            .container.has-text-left
              .title Payment Details
              .final-step__personal-details(v-for="(val, key) in model.paymentDetails")
                .columns.is-mobile
                  p.column.is-5-mobile.is-2-tablet
                    b {{ key | splitWords }}
                  p.column.is-6-mobile(v-if="key === 'cardNumber'")
                    | {{ val | concealNumber }}
                  p.column.is-6-mobile(v-else)
                    | {{ val }}
              hr
              .final-step__price {{ '= ' + flightRouteData.price + " €"}}
        template(slot='footer', slot-scope='props')
          .wizard-footer-left
            wizard-button(v-if='props.activeTabIndex > 0 && !props.isLastStep', :style='props.fillButtonStyle', @click.native='props.prevTab()') Previous
          .wizard-footer-right
            wizard-button(v-if='!props.isLastStep', @click.native='props.nextTab()', :style='props.fillButtonStyle') Next
            wizard-button.finish-button(v-else='', @click.native="onFinishBooking", :style='props.fillButtonStyle') {{props.isLastStep ? 'Buy' : 'Next'}}

</template>

<script>
import { required, numeric, email } from 'vuelidate/lib/validators';
import moment from 'moment';
import BNotification from 'buefy/src/components/notification/Notification.vue';
import * as Helpers from '../lib/helpers';
import { FlightRoute } from '../lib/model';

const today = new Date();

export default {
  name: 'booking',
  components: { BNotification },
  data() {
    return {
      tripSectionsData: {},
      flightRouteData: {},

      SIZE_PHONE: 768,
      SIZE_TABLET: 1024,
      isTabletSize: false,
      isPhoneSize: false,

      luggageOptions: [
        {
          id: '1x Carry-On, 1x Drop-Off Baggage (max. 23kg)',
          description: 'You chose the option to take one carry-on and one drop-off baggage (max. 23kg) with you',
        },
        {
          id: '1x Carry-On Baggage (max. 10kg)',
          description: 'You chose the option to take one carry-on and one drop-off baggage (max. 23kg) with you',
        },
      ],

      model: {
        personalDetails: {
          firstName: 'asdf',
          lastName: 'asdf',
          tel: '1234',
          birthdate: '1994-02-02',
          email: 'max.mustermann@gmx.de',
        },
        options: {
          seatReservation: false,
          luggageOption: '',
        },
        paymentDetails: {
          firstName: 'asdf',
          lastName: 'asdf',
          cardNumber: '0123456789',
          expirationDate: '12/19',
          securityCode: '123',
        },
      },
    };
  },
  validations: {
    model: {
      personalDetails: {
        firstName: {
          required,
        },
        lastName: {
          required,
        },
        birthdate: {
          required,
        },
        tel: {
          required,
          numeric,
        },
        email: {
          required,
          email,
        },
      },
      options: {

      },
      paymentDetails: {
        firstName: {
          required,
        },
        lastName: {
          required,
        },
        cardNumber: {
          required,
          numeric,
        },
        securityCode: {
          required,
          numeric,
        },
        expirationDate: {
          required,
        },
      },
    },
  },
  methods: {
    onUserCancelBooking() {
      this.$dialog.confirm({
        title: 'Cancel Booking',
        message: 'Do you really want to cancel the current booking process?',
        type: 'is-info',
        onConfirm: () => this.$router.push({ name: 'home' }),
      });
    },
    onUpdateTripSectionsEvent(event) {
      // making sure the right message event is processed
      if (event != null && event.data != null && event.data.sections != null) {
        if (Helpers.relevantTripDetailsChanged(Helpers.getFromLocalStorage(Helpers.LocalStorageKeys.TRIPSECTIONS), event.data)) {
          this.onUpdateTripSections(event.data);
        } else {
          Helpers.saveToLocalStorage(Helpers.LocalStorageKeys.TRIPSECTIONS, event.data);
        }
      }
    },

    onUpdateTripSections(tripSectionsData) {
      Helpers.saveToLocalStorage(Helpers.LocalStorageKeys.TRIPSECTIONS, tripSectionsData);
      this.onAbortBooking();
    },
    getDisplayedInputDstStr(city, iata) {
      if (iata === '') {
        return city;
      }
      return `${city} (${iata})`;
    },
    isEmpty(obj) {
      Helpers.isEmpty(obj);
    },
    onAbortBooking() {
      this.$dialog.alert({
        title: 'Trip Changed',
        message: 'Booking aborted due to trip changes in another component. Redirecting to search page.',
        type: 'is-warning',
        hasIcon: true,
        icon: 'exclamation-triangle',
        iconPack: 'fa',
        onConfirm: () => {
          this.$router.push({ name: 'home' });
        },
      });
    },
    isLastStep() {
      if (this.$refs.wizard) {
        return this.$refs.wizard.isLastStep;
      }
      return false;
    },
    validateStep(stepName) {
      this.$v.model[stepName].$touch();
      const isValid = !this.$v.model[stepName].$invalid;
      return isValid;
    },
    getTimeOfStay(flights, index) {
      if (flights[index + 1] === undefined) return 0;

      const start = moment(flights[index].travelDate);
      const end = moment(flights[index + 1].travelDate);

      return Math.round(moment.duration(end.diff(start)).asDays());
    },
    onResize(event) {
      // is tablet size
      if (event.target.innerWidth <= this.SIZE_TABLET && event.target.innerWidth > this.SIZE_PHONE) {
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
    onFinishBooking(event) {
      const self = this;

      this.flightRouteToTripDetails(this.flightRouteData);

      console.log(`updateTripSections with: ${JSON.stringify(this.tripSectionsData, null, 4)}`);
      window.parent.postMessage(this.tripSectionsData, '*');

      this.$toast.open({
        message: 'Booking was successful.',
        type: 'is-success',
      });
      this.$router.push({ name: 'home' });
    },
    // update trip sections data according to data model (see composition model uml)
    flightRouteToTripDetails(flightRouteData) {
      let prunedFlightRouteData = flightRouteData;
      for (const flight of prunedFlightRouteData.flights) {
        if (flight.travelDate !== undefined) delete flight.travelDate;
        for (const flightSegment of flight.flightSegments) {
          if (flightSegment.startLocation.input !== undefined) delete flightSegment.startLocation.input;
          if (flightSegment.endLocation.input !== undefined) delete flightSegment.endLocation.input;
        }
      }

      for (let i = 0; i < this.tripSectionsData.sections.length; i++) {
        this.$set(this.tripSectionsData.sections[i], 'transport', {
          type: 'plane',
          flights: [prunedFlightRouteData.flights[i], prunedFlightRouteData.flights[i + 1]],
        });
      }

      return this.tripSectionsData;
    },
  },
  filters: {
    splitWords(val) {
      let words = val;
      words = words[0].toUpperCase() + words.substring(1, words.length);

      return `${words.replace(/([a-z])([A-Z])/g, '$1 $2')}:`;
    },
    concealNumber(val) {
      let concealedNumber = '';
      if (val.length > 0) {
        const splitDigits = [val.substring(0, val.length - 2), val[val.length - 1]];
        concealedNumber = splitDigits[0].replace(/[0-9]/g, '*') + splitDigits[1];
      }
      return concealedNumber;
    },
    momentjs: (val, format) => moment(val).format(format),
  },
  beforeCreate() {
    this.moment = moment;
  },
  created() {
    this.model.options.luggageOption = this.luggageOptions[0].id;

    // retrieve saved data
    let localTripData = Helpers.getFromLocalStorage(Helpers.LocalStorageKeys.TRIPSECTIONS);
    if (localTripData !== null) this.tripSectionsData = localTripData;

    let localFlightRouteData = Helpers.getFromLocalStorage(Helpers.LocalStorageKeys.FLIGHTROUTE);
    if (localFlightRouteData !== null) this.flightRouteData = Helpers.JSONToFlightRoute(localFlightRouteData);
  },
  mounted() {
    // register event listeners for resize event
    window.addEventListener('resize', this.onResize);
    window.dispatchEvent(new Event('resize'));

    window.addEventListener('message', this.onUpdateTripSectionsEvent);
  },
  destroyed() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('message', this.onUpdateTripSectionsEvent);
  },
};
</script>

<style lang="sass" scoped>
.button.is-transparent
  background-color: transparent
  border: 0

.btn-back
  color: #fff
  position: absolute
  left: 0

.wizard-header
  display: none
.wizard-navigation
  margin: .2rem 0 2rem 0!important
.wizard-tab-content
  padding-top: 0 !important
.trip-section-content
  .container
    max-width: 800px !important
.container


.trip-section-wrapper
  padding: 2rem
@media screen and (max-width: 600px)
  .section
    padding: 3rem .5rem
.security-code-input
  width: 5rem

.final-step__plane-icon
  margin: 0 1rem

.final-step__flight
  margin-bottom: 1rem

.final-step__price
  font-size: 2rem
  text-decoration: double underline

.finish-button
  background-color: #20bc56 !important
  border-color: #20bc56 !important

</style>
