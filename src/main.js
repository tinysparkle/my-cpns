import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './directives/index'
import LazyLoad from './plugin/lazyload'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import * as utils from './utils/from-vue'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(LazyLoad, { default: require('@/assets/img/logo.png') })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
