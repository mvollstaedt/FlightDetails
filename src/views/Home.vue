<template lang="pug">
  .home
    section.flight-request-form
      .columns.is-mobile.has-text-left
        .column
          b-field(label="From")
            b-autocomplete(
              rounded
              v-model="name"
              :data="filteredDataArray"
              placeholder="Start Destination"
              @select="option => selected = option")
              template(slot="empty") No results found
        .column
          b-field(label="To")
            b-autocomplete(
            rounded
            v-model="name"
            :data="filteredDataArray"
            placeholder="Start Destination"
            @select="option => selected = option")
              template(slot="empty") No results found
        .column
          b-field(label="When")
            b-datepicker(
              rounded
              placeholder="Click to select..."
              :min-date="minDate"
              :max-date="maxDate")

</template>

<script>
// @ is an alias to /src
import BField from 'buefy/src/components/field/Field.vue';
import BAutocomplete from 'buefy/src/components/autocomplete/Autocomplete.vue';
import BDatepicker from 'buefy/src/components/datepicker/Datepicker.vue';

export default {
  name: 'home',
  components: {
    BDatepicker,
    BAutocomplete,
    BField,
  },
  data() {
    return {
      flightLocations: [
        'Barcelona (BCN)',
        'Madrid (MAD)',
        'Berlin (BER)',
        'Backbone',
        'Ember',
        'jQuery',
        'Meteor',
        'Node.js',
        'Polymer',
        'React',
        'RxJS',
        'Vue.js',
      ],
      name: '',
      selected: null,
    };
  },
  computed: {
    filteredDataArray() {
      return this.flightLocations.filter(option => option
        .toString()
        .toLowerCase()
        .indexOf(this.name.toLowerCase()) >= 0);
    },
  },
};
</script>
