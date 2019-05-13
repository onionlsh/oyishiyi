/*
    入口JS文件
*/
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'
import {Button} from 'mint-ui'

//注册一个全局组件
Vue.component(Button.name, Button) //mt-button

new Vue({
    el: '#app',
    render: h => h(App),
    router,
    store
})