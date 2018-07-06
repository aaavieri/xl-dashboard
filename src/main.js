import Vue from 'vue'
import VueRouter from 'vue-router'
import VueAnalytics from 'vue-analytics'
import DashboardPlugin from './dashboard-plugin'

// Plugins
import App from './App.vue'

// router setup
import routes from './routes/routes'

// plugin setup
Vue.use(VueRouter)
Vue.use(DashboardPlugin)

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'active'
});

Vue.use(VueAnalytics, {
  id: 'UA-46172202-9',
  router,
  autoTracking: {
    pageviewOnLoad: false
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router
});

/* We import element-ui variables at the end so they can override the default element-ui colors */
// import './assets/sass/element_variables.scss'



// WEBPACK FOOTER //
// ./src/main.js
