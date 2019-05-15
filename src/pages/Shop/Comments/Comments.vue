<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{shopInfo.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家 99%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <Star :score="shopInfo.serviceScore" :size="36"/>
            <span class="score">{{shopInfo.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <Star :score="shopInfo.foodScore" :size="36"/>
            <span class="score">{{shopInfo.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{shopInfo.deliveryTime}} 分钟</span>
          </div>
        </div>
      </div>

      <Split />
      
      <div class="ratingselect">
        <div class="rating-type border-1px">
          <span class="block positive" :class="{active : selectType===2}" @click="setSelectType(2)">
            全部
            <span class="count">{{comments.length}}</span>
          </span>
          <span class="block positive" :class="{active : selectType===0}" @click="setSelectType(0)">
            满意
            <span class="count">{{positiveComments}}</span>
          </span>
          <span class="block negative" :class="{active : selectType===1}" @click="setSelectType(1)">
            不满意
            <span class="count">{{comments.length - positiveComments}}</span>
          </span>
        </div>
        <div class="switch" :class="{on: isShowText}" @click="toggleShowText">
          <span class="iconfont icon-check_circle"></span>
          <span class="text">只看有内容的评价</span>
        </div>
      </div>
      <!-- 评价列表 -->
      <div class="rating-wrapper">
        <ul>
          <li class="rating-item" v-for="(comment, index) in filterComment" :key="index">
            <div class="avatar">
              <img
                width="28"
                height="28"
                :src="comment.avatar"
              >
            </div>
            <div class="content">
              <h1 class="name">{{comment.username}}</h1>
              <div class="star-wrapper">
                <Star :score="comment.score" :size="24"/>
                <span class="delivery">{{comment.deliveryTime ? `${comment.deliveryTime}分钟送达`:'准时送达'}}</span>
              </div>
              <p class="text">{{comment.text || '该用户没有留言'}}</p>
              <div class="recommend" v-if="comment.recommend">
                <span class="iconfont" :class="comment.rateType === 0 ? 'icon-thumb_up':'icon-thumb_down'"></span>
                <span class="item" v-for="(rec, index) in comment.recommend" :key="index">{{rec}}</span>
              </div>
              <div class="time">{{comment.rateTime}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Star from '../../../components/Star/Star.vue'
import {mapState,mapGetters} from 'vuex'
import BScroll from 'better-scroll'


export default {
    data() {
        return {
            selectType: 2, //0好评，1差评，2全部（跟comment.rateType保持一致，避免混乱）
            isShowText: true //是否只显示有内容的评价
        }
    },
    components:{
        Star
    },
    mounted() {
        //这里只是执行了请求，当前实例还没有获取到comments
        this.$store.dispatch('getShopComments',() => {
            this.$nextTick(() => {
                //初始化滚轮
                new BScroll(this.$refs.ratings,{
                    click: true
                })
            })
        })
    },
    computed: {
        ...mapState(['shopInfo','comments']),
        ...mapGetters(['positiveComments']),

        //计算属性
        //1.根据selectType决定显示comment的内容
        //2.根据showText决定是否显示comment的内容
        filterComment(){
            const {selectType,isShowText,comments} = this
            /**
                只考虑comment
                1. rateType :  0/1
                    selectType : 0/1/2

                2. text: 有值/无值

             */

            return comments.filter((com) => {
                //过滤体
                const {rateType,text} = com
                
                // if(selectType === rateType){
                //     return (selectType === rateType) && (isShowText? text.length>0 : true)
                // }else if(selectType === 2){
                //     return (isShowText? text.length>0 : true)
                // }else{
                //     (isShowText? text.length>0 : true)
                // }


                //高级版
                // 确实比较高级，但(rateType === 2 || rateType === selectType)一定要注意顺序
                return (selectType === 2 || selectType === rateType) && (!isShowText || text.length > 0)

                

            })
        }
    },

    methods: {
        //切换
        setSelectType(selectType){
            this.selectType = selectType
        },

        toggleShowText(){
            this.isShowText = !this.isShowText
        }
    },

}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/mixins.styl"

  .ratings
    position: absolute
    top: 195px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    background: #fff
    .overview
      display: flex
      padding: 18px 0
      .overview-left
        flex: 0 0 137px
        padding: 6px 0
        width: 137px
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        text-align: center
        @media only screen and (max-width: 320px)
          flex: 0 0 120px
          width: 120px
        .score
          margin-bottom: 6px
          line-height: 28px
          font-size: 24px
          color: rgb(255, 153, 0)
        .title
          margin-bottom: 8px
          line-height: 12px
          font-size: 12px
          color: rgb(7, 17, 27)
        .rank
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
      .overview-right
        flex: 1
        padding: 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding-left: 6px
        .score-wrapper
          margin-bottom: 8px
          font-size: 0
          .title
            display: inline-block
            line-height: 18px
            vertical-align: top
            font-size: 12px
            color: rgb(7, 17, 27)
          .star
            display: inline-block
            margin: 0 12px
            vertical-align: top
          .score
            display: inline-block
            line-height: 18px
            vertical-align: top
            font-size: 12px
            color: rgb(255, 153, 0)
        .delivery-wrapper
          font-size: 0
          .title
            line-height: 18px
            font-size: 12px
            color: rgb(7, 17, 27)
          .delivery
            margin-left: 12px
            font-size: 12px
            color: rgb(147, 153, 159)
    .ratingselect
      .rating-type
        padding: 18px 0
        margin: 0 18px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 0
        .block
          display: inline-block
          padding: 8px 12px
          margin-right: 8px
          line-height: 16px
          border-radius: 1px
          font-size: 12px
          color: rgb(77, 85, 93)
          background: rgba(77, 85, 93, 0.2)
          &.active
            background: $green
            color: #fff
          .count
            margin-left: 2px
            font-size: 8px
      .switch
        padding: 12px 18px
        line-height: 24px
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        color: rgb(147, 153, 159)
        font-size: 0
        &.on
          .icon-check_circle
            color: $green
        .icon-check_circle
          display: inline-block
          vertical-align: top
          margin-right: 4px
          font-size: 24px
        .text
          display: inline-block
          vertical-align: top
          font-size: 12px
    .rating-wrapper
      padding: 0 18px
      .rating-item
        display: flex
        padding: 18px 0
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        .avatar
          flex: 0 0 28px
          width: 28px
          margin-right: 12px
          img
            border-radius: 50%
        .content
          position: relative
          flex: 1
          .name
            margin-bottom: 4px
            line-height: 12px
            font-size: 10px
            color: rgb(7, 17, 27)
          .star-wrapper
            margin-bottom: 6px
            font-size: 0
            .star
              display: inline-block
              margin-right: 6px
              vertical-align: top
            .delivery
              display: inline-block
              vertical-align: top
              line-height: 12px
              font-size: 10px
              color: rgb(147, 153, 159)
          .text
            margin-bottom: 8px
            line-height: 18px
            color: rgb(7, 17, 27)
            font-size: 12px
          .recommend
            line-height: 16px
            font-size: 0
            .icon-thumb_up, .icon-thumb_down, .item
              display: inline-block
              margin: 0 8px 4px 0
              font-size: 9px
            .icon-thumb_up
              color: $yellow
            .icon-thumb_down
              color: rgb(147, 153, 159)

            .item
              padding: 0 6px
              border: 1px solid rgba(7, 17, 27, 0.1)
              border-radius: 1px
              color: rgb(147, 153, 159)
              background: #fff
          .time
            position: absolute
            top: 0
            right: 0
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
</style>
