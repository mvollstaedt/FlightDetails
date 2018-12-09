import Vue from 'vue';

import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import App from './App.vue';
import Router from 'vue-router';
import store from './store';
import VuePaginate from 'vue-paginate';
import Vuelidate from 'vuelidate';

import VueFormWizard from 'vue-form-wizard';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';

import Home from './views/Home.vue';
import Booking from './views/Booking.vue';

Vue.use(Buefy);
Vue.use(VuePaginate);
Vue.use(Router);
Vue.use(VueFormWizard);
Vue.use(Vuelidate);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/booking',
      name: 'booking',
      component: Booking,
      props: true,
    },
  ],
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
