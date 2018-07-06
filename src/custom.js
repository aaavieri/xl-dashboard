import Vue from 'vue'
import VueRouter from 'vue-router'
import VueAnalytics from 'vue-analytics'
import DashboardPlugin from './dashboard-plugin'

// Plugins
import CustomApp from './CustomApp'

// router setup
import routes from './routes/customRoutes'

// import 'three'
import 'src/assets/js/love'

import DictionaryPlugin from './components/DictionaryPlugin'
import HttpPlugin from './components/HttpPlugin'
import { Loading } from 'element-ui';

// plugin setup
Vue.use(VueRouter)
Vue.use(DashboardPlugin)
Vue.use(DictionaryPlugin)
Vue.use(HttpPlugin)
Vue.use(Loading)

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'active'
})

Vue.use(VueAnalytics, {
  id: 'UA-46172202-9',
  router,
  autoTracking: {
    pageviewOnLoad: false
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(CustomApp),
  router
})

/* We import element-ui variables at the end so they can override the default element-ui colors */
// import './assets/sass/element_variables.scss'

// WEBPACK FOOTER //
// ./src/main.js
