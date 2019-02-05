<template lang="pug">
  .booking
    .hero.is-primary
      .hero-body
        .container.is-fluid.has-text-centered
          a.button.is-pulled-left.is-transparent.btn-back(@click="onUserCancelBooking")
            span(style="font-size: 1.8rem;")
              i.fas.fa-chevron-left
          h1.title Buchung
            |
            i.fas.fa-clipboard.title-icon
          h2.subtitle Gleich Geschafft
    .form-wizard
      form-wizard(title="", subtitle="", stepSize="xs", color="#7957d5", errorColor="#ff3860", finishButtonText="Complete Booking", ref="wizard")
        tab-content(title='Options' :before-change="() => validateStep('options')")
          section.section.trip-section-content(v-if="!isEmpty(flightRouteData)")
            .container
              .title.has-text-left Flugdaten
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
              .title.has-text-left Weitere Optionen
              b-field( horizontal label="Gepäckoption")
                b-select(v-model="model.options.luggageOption")
                  option(v-for="option in luggageOptions", :value="option.id", :key="option.id") {{ option.id }}
              b-field( horizontal label="Sitzplatzreservierung", class="has-text-left")
                b-switch(v-model="model.options.seatReservation")

        tab-content(title='Persönliche Angaben', :before-change="() => validateStep('personalDetails')")
          .section.has-text-left
            .container
              .title Persönliche Daten
              .field.is-horizontal
                .field-label.is-normal
                  label.label Name
                .field-body
                  .field
                    p.control.is-expanded.has-icons-right
                      input.input(type="text" placeholder="Last Name", v-model.trim="model.personalDetails.lastName", @input="$v.model.personalDetails.lastName.$touch()", :class="{'is-danger': $v.model.personalDetails.lastName.$error}")
                      span.icon.is-small.is-right(v-if="$v.model.personalDetails.lastName.$error")
                        i.fas.fa-exclamation-triangle
                    p.help.is-danger(v-if="$v.model.personalDetails.lastName.$error") Der Nachname ist invalide
                  .field
                    p.control.is-expanded.has-icons-right
                      input.input(type="text" placeholder="First Name", v-model.trim="model.personalDetails.firstName", @input="$v.model.personalDetails.firstName.$touch()", :class="{'is-danger': $v.model.personalDetails.firstName.$error}")
                      span.icon.is-small.is-right(v-if="$v.model.personalDetails.firstName.$error")
                        i.fas.fa-exclamation-triangle
                    p.help.is-danger(v-if="$v.model.personalDetails.firstName.$error") Der Vorname ist invalide
              .field.is-horizontal
                .field-label.is-normal
                  label.label Tel
                .field-body
                  .field
                    p.control.is-expanded.has-icons-right
                      input.input(type="tel" placeholder="(+49) 12345678", v-model.trim="model.personalDetails.tel", @input="$v.model.personalDetails.tel.$touch()", :class="{'is-danger': $v.model.personalDetails.tel.$error}")
                      span.icon.is-small.is-right(v-if="$v.model.personalDetails.tel.$error")
                        i.fas.fa-exclamation-triangle
                    p.help.is-danger(v-if="$v.model.personalDetails.tel.$error") Die Telefonnummer ist invalide
              .field.is-horizontal
                .field-label.is-normal
                  label.label Geburtsdatum
                .field-body
                  .field
                    p.control.is-expanded.has-icons-right
                      input.input(type="date" placeholder="2018-01-01", min="1940-01-01", max="2000-01-01", v-model.trim="model.personalDetails.birthdate", @input="$v.model.personalDetails.birthdate.$touch()", @change="$v.model.personalDetails.birthdate.$touch()", :class="{'is-danger': $v.model.personalDetails.birthdate.$error}")
                      span.icon.is-small.is-right(v-if="$v.model.personalDetails.birthdate.$error")
                        i.fas.fa-exclamation-triangle
                    p.help.is-danger(v-if="$v.model.personalDetails.birthdate.$error") Das Geburtsdatum ist invalide
              .field.is-horizontal
                .field-label.is-normal
                  label.label Email
                .field-body
                  .field
                    p.control.is-expanded.has-icons-right
                      input.input(type="email" placeholder="max.muster@gmx.de", v-model.trim="model.personalDetails.email", @input="$v.model.personalDetails.email.$touch()", :class="{'is-danger': $v.model.personalDetails.email.$error}")
                      span.icon.is-small.is-right(v-if="$v.model.personalDetails.email.$error")
                        i.fas.fa-exclamation-triangle
                    p.help.is-danger(v-if="$v.model.personalDetails.email.$error") Die Email-Adresse ist invalide
        tab-content(title='Zahlungsinformationen')
          .section.has-text-left
            .container
              .title Zahlungsinformationen
              b-notification
                | Derzeit akzeptieren wir nur Kreditkarten als Zahlungsmöglichkeit. Wir entschuldigen uns für jegliche Unannehmlichkeiten.
              .field.is-horizontal
                .field-label.is-normal
                  label.label Name des Kartenbesitzers
                .field-body
                  .field
                    p.control.is-expanded.has-icons-right
                      input.input(type="text" placeholder="Last Name", v-model.trim="model.paymentDetails.lastName", @input="$v.model.paymentDetails.lastName.$touch()", :class="{'is-danger': $v.model.paymentDetails.lastName.$error}")
                      span.icon.is-small.is-right(v-if="$v.model.paymentDetails.lastName.$error")
                        i.fas.fa-exclamation-triangle
                    p.help.is-danger(v-if="$v.model.paymentDetails.lastName.$error") Der Nachname ist invalide
                  .field
                    p.control.is-expanded.has-icons-right
                      input.input(type="text" placeholder="First Name", v-model.trim="model.paymentDetails.firstName", @input="$v.model.paymentDetails.firstName.$touch()", :class="{'is-danger': $v.model.paymentDetails.firstName.$error}")
                      span.icon.is-small.is-right(v-if="$v.model.paymentDetails.firstName.$error")
                        i.fas.fa-exclamation-triangle
                    p.help.is-danger(v-if="$v.model.paymentDetails.firstName.$error") Der Vorname ist invalide
              .field.is-horizontal
                .field-label.is-normal
                  label.label Kartennummer
                .field-body
                  .field
                    p.control.is-expanded.has-icons-right
                      input.input(type="number" placeholder="0123456789", v-model.trim="model.paymentDetails.cardNumber", @input="$v.model.paymentDetails.cardNumber.$touch()", :class="{'is-danger': $v.model.paymentDetails.cardNumber.$error}")
                      span.icon.is-small.is-right(v-if="$v.model.paymentDetails.cardNumber.$error")
                        i.fas.fa-exclamation-triangle
                    p.help.is-danger(v-if="$v.model.paymentDetails.cardNumber.$error") Die Kartennummer ist invalide
              .field.is-horizontal
                .field-label.is-normal
                  label.label Ablaufdatum
                .field-body
                  .field
                    p.control.is-expanded.has-icons-right
                      input.input(type="text" placeholder="03/18", v-model.trim="model.paymentDetails.expirationDate", @input="$v.model.paymentDetails.expirationDate.$touch()", :class="{'is-danger': $v.model.paymentDetails.expirationDate.$error}")
                      span.icon.is-small.is-right(v-if="$v.model.paymentDetails.expirationDate.$error")
                        i.fas.fa-exclamation-triangle
                    p.help.is-danger(v-if="$v.model.paymentDetails.expirationDate.$error") Das Ablaufdatum ist invalide
              .field.is-horizontal
                .field-label.is-normal
                  label.label Sicherheitscode
                .field-body
                  .field
                    p.control.is-expanded.has-icons-right.security-code-input
                      input.input(type="number" placeholder="123", v-model.trim="model.paymentDetails.securityCode", @input="$v.model.paymentDetails.securityCode.$touch()", :class="{ 'is-danger': $v.model.paymentDetails.securityCode.$error}")
                      span.icon.is-small.is-right(v-if="$v.model.paymentDetails.securityCode.$error")
                        i.fas.fa-exclamation-triangle
                    p.help.is-danger(v-if="$v.model.paymentDetails.securityCode.$error") Der Sicherheitscode ist invalide
        tab-content(title='Überprüfung')
          section.section
            .container.has-text-left
              .title Flugdaten
              .final-step__flight(v-for="flight in flightRouteData.flights")
                h3 {{ moment(flight.travelDate).format('DD.MM.YY') }}
                p {{ getDisplayedInputDstStr(flight.startLocation.city, flight.startLocation.iata) }}
                  span.fas.fa-plane.final-step__plane-icon
                  | {{ getDisplayedInputDstStr(flight.endLocation.city, flight.endLocation.iata) }}
          section.section
            .container.has-text-left
              .title Persönliche Daten
              .final-step__personal-details(v-for="(val, key) in model.personalDetails")
                .columns.is-mobile
                  p.column.is-5-mobile.is-2-tablet
                    b {{ localiseDE(key) }}
                  p.column.is-6-mobile
                    | {{ val }}
          section.section
            .container.has-text-left
              .title Zahlungsinformationen
              .final-step__personal-details(v-for="(val, key) in model.paymentDetails")
                .columns.is-mobile
                  p.column.is-5-mobile.is-2-tablet
                    b {{ localiseDE(key) }}
                  p.column.is-6-mobile(v-if="key === 'cardNumber'")
                    | {{ val | concealNumber }}
                  p.column.is-6-mobile(v-else)
                    | {{ val }}
              hr
              .final-step__price {{ '= ' + flightRouteData.price + " €"}}
        template(slot='footer', slot-scope='props')
          .wizard-footer-left
            wizard-button(v-if='props.activeTabIndex > 0 && !props.isLastStep', :style='props.fillButtonStyle', @click.native='props.prevTab()') Zurück
          .wizard-footer-right
            wizard-button(v-if='!props.isLastStep', @click.native='props.nextTab()', :style='props.fillButtonStyle') Weiter
            wizard-button.finish-button(v-else='', @click.native="onFinishBooking", :style='props.fillButtonStyle') {{props.isLastStep ? 'Zahlen' : 'Weiter'}}

</template>

<script>
import { required, numeric, email } from 'vuelidate/lib/validators';
import moment from 'moment';
import BNotification from 'buefy/src/components/notification/Notification.vue';
import * as Helpers from '../lib/helpers';

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
          id: '1x Handgepäck, 1x Reisegepäck (max. 23kg)',
        },
        {
          id: '1x Carry-On Baggage (max. 10kg)',
        },
      ],

      localesDE: {
        firstName: 'Vorname',
        lastName: 'Nachname',
        tel: 'Tel',
        birthdate: 'Geburtsdatum',
        email: 'Email',
        seatReservation: 'Sitzplatzreservierung',
        luggageOption: 'Gepäckoption',
        cardNumber: 'Kartennummer',
        expirationDate: 'Ablaufdatum',
        securityCode: 'Sicherheitscode',
      },

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
        title: 'Buchung abbrechen',
        message: 'Möchten Sie wirklich den aktuellen Buchungsprozess abbrechen?',
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
    localiseDE(val) {
      const localisedStr = this.localesDE[val];
      if (localisedStr === null || localisedStr === '') return val;
      return localisedStr;
    },
    isEmpty(obj) {
      Helpers.isEmpty(obj);
    },
    onAbortBooking() {
      this.$dialog.alert({
        title: 'Tripänderung',
        message: 'Der Buchungsprozess wurde abgebrochen, da am Trip Änderungen in einer anderen Komponente unternommen wurden. Sie werden zurück zur Flugsuche geleitet.',
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
        message: 'Buchung war erfolgreich.',
        type: 'is-success',
      });
      this.$router.push({ name: 'home' });
    },
    // update trip sections data according to data model (see composition model uml)
    flightRouteToTripDetails(flightRouteData) {
      const prunedFlightRouteData = flightRouteData;
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
    const localTripData = Helpers.getFromLocalStorage(Helpers.LocalStorageKeys.TRIPSECTIONS);
    if (localTripData !== null) this.tripSectionsData = localTripData;

    const localFlightRouteData = Helpers.getFromLocalStorage(Helpers.LocalStorageKeys.FLIGHTROUTE);
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
