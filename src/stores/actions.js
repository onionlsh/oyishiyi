/*
通过mutation间接更新state的多个方法的对象
 */

import {
    RECEIVE_ADDRESS,
    RECEIVE_CATEGORYS,
    RECEIVE_SHOPS,
    RECEIVE_USER_INFO,
    RESET_USER_INFO,
    RECEIVE_GOODS,
    RECEIVE_COMMENTS,
    RECEIVE_INFO,
    INCREMENT_FOOD_COUNT,
    DECREMENT_FOOD_COUNT,
    CLEAR_CAR,
    SEARCH_SHOP
 } from './mutation-types'
import {
    reqAddress,
    reqFoodCategorys,
    reqShops,
    reqUserInfo,
    reqLogout,
    reqShopGoods,
    reqShopComments,
    reqShopInfo,
    reqSearchShop
} from '../api'

//主意传递的参数要同名，因为用了ES6的特性
 export default{
    //异步获取地址
    async getAddress ({commit,state}){
        const geohash = state.latitude + ',' +state.longitude
        const result = await reqAddress(geohash)
        //如果请求成功，则提交一个mutations
        if(result.code === 0){
            const address =  result.data
            commit(RECEIVE_ADDRESS,{address})
        }
    },

    //异步获取分类
    async getCategorys ({commit}){
        const result = await reqFoodCategorys()
        //如果请求成功，则提交一个mutations
        if(result.code === 0){
            const categorys = result.data
            commit(RECEIVE_CATEGORYS,{categorys})
        }
        
    },

    //异步获取商店
    async getShops ({commit,state}){
        const {longitude, latitude} = state//ES6特性
        const result = await reqShops(longitude, latitude)
        if(result.code === 0){
            const shops = result.data
            commit(RECEIVE_SHOPS, {shops})
        }
    },

    //同步记录用户信息
    recordUser({commit}, userInfo){
        commit(RECEIVE_USER_INFO,{userInfo})
    },

    //异步获取用户信息（从服务器）
    async getUserInfo({commit}){
        const result = await reqUserInfo()
        if(result.code === 0){
            let userInfo = result.data
            commit(RECEIVE_USER_INFO,{userInfo})
        }
    },

    //异步退出
    async logout({commit}){
        const result = await reqLogout()
        if(result.code === 0){
            commit(RESET_USER_INFO)
        }
    },

    //MOCK请求
    async getShopGoods({commit}, callback){
        const result = await reqShopGoods()
        if(result.code === 0){
            let goods = result.data
            commit(RECEIVE_GOODS,{goods})

            callback && callback()
        }
    },
    //执行成功后回调函数
    async getShopComments({commit},callback){
        const result = await reqShopComments()
        if(result.code === 0){
            let comments = result.data
            commit(RECEIVE_COMMENTS,{comments})

            callback && callback()
        }
    },
    async getShopInfo({commit}){
        const result = await reqShopInfo()
        if(result.code === 0){
            let shopInfo = result.data
            commit(RECEIVE_INFO,{shopInfo})
        }
    },

    //更新食物数量
    updateFoodCount({commit},{isAdd,food}){
        if(isAdd){
            commit(INCREMENT_FOOD_COUNT,{food})
        }else{
            commit(DECREMENT_FOOD_COUNT,{food})
        }
    },

    //情况购物车
    clearCar({commit}){
        commit(CLEAR_CAR)
    },

    //获取搜索店铺
    async getSearchShops({commit,state},keyword){
        const geohash = state.latitude + ',' + state.longitude
        const result = await reqSearchShop(geohash, keyword)
        if(result.code === 0){
            const searchShops = result.data
            commit(SEARCH_SHOP,{searchShops})
        }
    }
 }