import 'font-awesome/css/font-awesome.css'
import './config/bootstrap'

import Vue from 'vue'
import App from './App'

import store from './config/store'
import router from './config/router'

Vue.config.productionTip = false

// TEMPORARIO
require('axios').defaults.headers.common['Authorization'] = 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6Ikx1Y2FzIE9saXZlaXJhIiwiZW1haWwiOiJsdWNhc0BnbWFpbC5jb20iLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNjE0MDMwMTE3LCJleHAiOjE2MTQyODkzMTd9.XRqdg0iJZxAjzvegfERQ3N9T3HNRo1rIkBb_yms1vrg'

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')