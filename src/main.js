import Vue from 'vue';

import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import Router from 'vue-router';
import VuePaginate from 'vue-paginate';
import Vuelidate from 'vuelidate';

import VueFormWizard from 'vue-form-wizard';
import store from './store';
import App from './App.vue';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';

import Home from './views/Home.vue';
import Booking from './views/Booking.vue';

import { isEmpty } from './lib/helpers';

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
      // redirect if no flight route was selected
      beforeEnter: (to, from, next) => {
        if (isEmpty(to.params)) next({ name: 'home' });
        next();
      },
    },
  ],
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
