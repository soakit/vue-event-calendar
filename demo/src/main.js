import Vue from 'vue'
import App from './App.vue'

import vueEventCalendar from 'vue-event-calendar'

Vue.use(vueEventCalendar, {locale: 'en', separator: '-'})

new Vue({
  el: '#app',
  render: h => h(App)
})
