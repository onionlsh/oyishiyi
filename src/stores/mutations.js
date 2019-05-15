/*
    直接更新state的多个方法的对象
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
 import Vue from 'vue'

 export default {
    [RECEIVE_ADDRESS](state, {address}){
        state.address = address
    },
    [RECEIVE_CATEGORYS](state,{categorys}){
        state.categorys = categorys
    },
    [RECEIVE_SHOPS](state,{shops}){
        state.shops = shops
    },
    [RECEIVE_USER_INFO](state,{userInfo}){
        state.userInfo = userInfo
    },
    [RESET_USER_INFO](state){
        state.userInfo = {}
    },
    [RECEIVE_GOODS](state,{goods}){
        state.goods = goods
    },
    [RECEIVE_COMMENTS](state,{comments}){
        state.comments = comments
    },
    [RECEIVE_INFO](state,{shopInfo}){
        state.shopInfo = shopInfo
    },

    // 添加购物车的食物，food.count+1
    [INCREMENT_FOOD_COUNT](state,{food}){
        if(!food.count){
            Vue.set(food,'count',1)
            //添加食物时，把food添加到carFoods
            state.carFoods.push(food)
        }else{
            food.count++
        }
    },
    // 移除购物车中的食物，food.count-1
    [DECREMENT_FOOD_COUNT](state,{food}){
        if(food.count){
            food.count--
            if(food.count === 0){
                //数量为0，从carFoods中移除
                state.carFoods.splice(state.carFoods.indexOf(food),1)
            }
        }
    },

    //清空购物车:注意清空顺序
    [CLEAR_CAR](state){
        //清空food
        state.carFoods.forEach((food) => {
            food.count = 0
        })
        //清空carFoods
        state.carFoods = []
    },

    //根据关键字搜索店铺
    [SEARCH_SHOP](state,{searchShops}){
       state.searchShops = searchShops
    }
 }