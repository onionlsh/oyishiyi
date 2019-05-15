/*
    入口JS文件
*/
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'
import {Button} from 'mint-ui'
import Split from './components/Split/Split.vue'
//引入mock
import './mock/mockServer.js'

//注册一个全局组件
Vue.component(Button.name, Button) //mt-button
//注册自定义的全局组件
Vue.component('Split', Split)

new Vue({
    el: '#app',
    render: h => h(App),
    router,
    store
})