import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store' //状态管理全局定义
import ElementUI from 'element-ui' //引入ui库
import 'element-ui/lib/theme-chalk/index.css' //引入ui库css
import './assets/css/reset.css' //清除默认样式

import axios from './http' //引入拦截器
Vue.prototype.$http = axios; //vue原型定义$http方法
Vue.use(ElementUI); //使用ui
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store, //使用状态管理
    components: { App },
    template: '<App/>'
})