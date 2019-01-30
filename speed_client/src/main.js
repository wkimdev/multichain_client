import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import axios from 'axios'
import Vuetify from 'vuetify'
import moment from 'moment-timezone'
import {API_KEY} from 'src/components/Dashboard/Views/Maps/API_KEY'
import * as VueGoogleMaps from 'vue2-google-maps'
import VModal from 'vue-js-modal'
// 전체 css
//import style from 'src/assets/css/style.css'

// Bootstrap plugin
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// LightBootstrap plugin
import LightBootstrap from './light-bootstrap-main'

// router setup
import routes from './routes/routes'

// in your main.js file
import Maps from 'src/components/Dashboard/Views/Maps.vue'

Vue.component('Maps', Maps)

// plugin setup
//Vue.use(style)
Vue.use(VueRouter)
Vue.use(BootstrapVue)
Vue.use(LightBootstrap)
Vue.use(VModal, { dynamic: true })
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
  routes, // short for routes: routes
  linkActiveClass: 'nav-item active'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router
})
