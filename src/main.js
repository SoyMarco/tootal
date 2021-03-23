import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from "./plugins/vuetify";
import axios from "axios";
import { createProvider } from './vue-apollo'

Vue.config.productionTip = false

axios.defaults.baseURL='https://tootal.herokuapp.com/api'
//axios.defaults.baseURL='http://192.168.100.223:3000/api'


new Vue({
  router,
  store,
  vuetify,
  apolloProvider: createProvider(),
  render: (h) => h(App)
}).$mount("#app");
