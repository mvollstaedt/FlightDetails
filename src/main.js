import Vue from 'vue';
import Buefy from 'buefy';
import 'buefy/dist/buefy.css';
import App from './App.vue';
import router from './router';
import store from './store';
import VuePaginate from 'vue-paginate';

Vue.use(Buefy);
Vue.use(VuePaginate);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
