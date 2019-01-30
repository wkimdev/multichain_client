import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import routes from './routes/routes'
import BootstrapVue from 'bootstrap-vue'
import axios from 'axios'
import Vuetify from 'vuetify'
import moment from 'moment-timezone'

// Bootstrap plugin
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VModal from 'vue-js-modal'
import * as VueGoogleMaps from 'vue2-google-maps'
import {API_KEY} from 'src/components/Dashboard/Views/Maps/API_KEY'
import SockJS from 'sockjs-client'
// import webstomp from 'webstomp-client'

// LightBootstrap plugin
import LightBootstrap from './light-bootstrap-main'

import PopupModal from 'src/components/Dashboard/Views/PopupModal.vue'
import Maps from 'src/components/Dashboard/Views/Maps.vue'
import TableList from 'src/components/Dashboard/Views/TableList.vue'

Vue.component('Maps', Maps)
Vue.component('PopupModal', PopupModal)
Vue.component('TableList', TableList)

// plugin setup
Vue.use(VueRouter)
Vue.use(VModal, { dynamic: true })
Vue.use(BootstrapVue)
Vue.use(LightBootstrap)
Vue.use(SockJS)
// Vue.use(webstomp)
Vue.use(Vuetify)
Vue.use(moment)
Vue.use(VueGoogleMaps, {
  load: {
    key: API_KEY
  }
})

//localhost set property

//Vue.prototype.localUrl = '192.168.15.102'
Vue.prototype.localUrl = '192.168.0.142'
//Vue.prototype.localUrl = '192.168.15.101'
Vue.prototype.$http = axios

// configure router
const router = new VueRouter({
  // mode: 'history',
  routes, // short for routes: routes
  linkActiveClass: 'nav-item active'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),  
  router,
  data: {
    localUrl: ''
  },
  beforeCreated: function() {
    console.log('localUrl_m :'+localUrl_m);
  }
})
