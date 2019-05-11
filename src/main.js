/*
    入口JS文件
*/
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'

new Vue({
    el: '#app',
    render: h => h(App),
    router,
    store
})