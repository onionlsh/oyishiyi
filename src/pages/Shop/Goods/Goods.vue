<template>
  <div>
    <div class="goods">
        <!-- 菜单列表 -->
      <div class="menu-wrapper">
        <ul>
          <li class="menu-item" v-for="(good,index) in goods" :key="index"
            :class="{current: index===currentIndex}" @click="clickItemMenu(index)">
            <span class="text bottom-border-1px">
              <img class="icon" :src="good.icon" v-if="good.icon">
              {{good.name}}
            </span>
          </li>
        </ul>
      </div>

      <!-- 食物列表 -->
      <div class="foods-wrapper">
        <ul ref="foodsUI">
          <li class="food-list-hook" v-for="(good,index) in goods" :key="index">
            <h1 class="title">{{good.name}}</h1>
            <ul>
              <li class="food-item bottom-border-1px" v-for="(food, index) in good.foods" 
              :key="index"  @click="showFoodInfo(food)">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售 {{food.sellCount}} 份</span>
                    <span>好评率 {{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <CarControl :food="food" />
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <!-- 购物车 -->
      <ShopCar />
    </div>
    <!-- 食物详情 -->
    <Food :food="food" ref="food"/>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Food from "../../../components/Food/Food.vue";
import CarControl from "../../../components/CarControl/CarControl.vue";
import ShopCar from "../../../components/ShopCar/ShopCar.vue";
import BScroll from 'better-scroll'

export default {

    data(){
        return {
            food:{},
            scrollY: 0,
            tops:[] 
        }
    },

    components: {
        Food,
        CarControl,
        ShopCar
    },

    mounted(){
        this.$store.dispatch('getShopGoods',() =>{ //数据更新后执行
            this.$nextTick(() => {
                //获取到数据后，更新两个滚轮
               this._initScroll()
               this._initTops()
            })
        })


    },
    
    computed:{
        ...mapState(['goods']),


        // 计算右侧滚动
        currentIndex(){
            const {scrollY, tops} = this
            
            //findIndex返回传入一个测试条件（函数）符合条件的数组第一个元素位置。
            const index = tops.findIndex( (currentValue, index) => {
                return scrollY >= currentValue && scrollY < tops[index + 1]
            })
            //console.log(scrollY);
            
            return index
            
        }

    },
    methods:{
        /**
         * 初始化滚轮
         */
        _initScroll(){
            new BScroll('.menu-wrapper',{
                click: true
            })

            this.foodsScroll = new BScroll('.foods-wrapper',{
                probeType: 2,  // 因为惯性滑动不会触发
                click: true
            })

            this.foodsScroll.on('scroll',({x,y}) =>{
                //console.log(x,y)
                this.scrollY = Math.abs(y)
            })

            this.foodsScroll.on('scrollEnd',({x,y}) => {
                this.scrollY = Math.abs(y)
            })
        },

        /**
         * 初始化tops，tops只需要初始化一次，不会再改变（如果foods数据变化，才会再调用这个方法，）
         */
        _initTops(){
            //初始化tops
            const tops = []
            let top = 0
            tops.push(top)

            //找到所有li列表 给UI设置Ref属性，更快找到lis，因为会遍历整个页面去找lis
            let lis = this.$refs.foodsUI.getElementsByClassName('food-list-hook')
            // 把lis变为真数组:slice.call
            let lisArr =  Array.prototype.slice.call(lis)
            lisArr.forEach(li =>{
                top += li.clientHeight;
                tops.push(top)
            })

            this.tops = tops
            //console.log(tops)
        },

        clickItemMenu(index){
            const scrollY = this.tops[index]
            this.scrollY = scrollY
            this.foodsScroll.scrollTo(0, -scrollY, 300)
        },

        //显示食物详情
        showFoodInfo(food){
          this.food = food
          this.$refs.food.toggleShow()
        }
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/mixins.styl"
  .goods
    display: flex
    position: absolute
    top: 195px
    bottom: 46px
    width: 100%
    background: #fff;
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          color: $green
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
