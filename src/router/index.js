import Vue from 'vue'
import VueRouter from 'vue-router'

//引入
import Home from '../pages/Home/Home.vue'
import Search from '../pages/Search/Search.vue';
import Order from '../pages/Order/Order.vue';
import Person from '../pages/Person/Person.vue';
import Login from '../pages/Login/Login.vue';

//声明使用插件
Vue.use(VueRouter)

export default new VueRouter({
    //配置所有路由
    routes: [
        {
            path: '/',
            redirect: '/home',//重定向到home
        },
        {
            path: '/home',
            component: Home,
            meta:{
                showFooter:true
            }
        },
        {
            path: '/search',
            component: Search,
            meta:{
                showFooter:true
            }
        },
        {
            path: '/order',
            component: Order,
            meta:{
                showFooter:true
            }
        },
        {
            path: '/person',
            component: Person,
            meta:{
                showFooter:true
            }
        },
        {
            path: '/login',
            component: Login
        }
    ]
})