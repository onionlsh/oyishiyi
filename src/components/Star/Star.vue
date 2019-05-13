<!--
    星星图片组件：on 满一颗星
-->

<template>
    <div class="star" :class="'star-'+size">
        <span class="star-item" v-for="(sc, index) in starClasses " :key="index" :class="sc"></span>
    </div>
</template>

<script>
const CLASS_ON = "on"
const CLASS_HALF = "half"
const CLASS_OFF = "off"

export default {
   props:{
       size: Number,
       score: Number
   },

   computed:{
       starClasses(){
         /**
          * eg:
          * star :4.7 
          * 4.7 = 4-on + (0.7*10 > 5 ? 1: 0) - half + (5 - 前面star的个数)-off
          */

          const {score} = this
          const scoreIntger = Math.floor(score)
          const scores = []
          //满星
          for(let i=0; i<scoreIntger; i++){
              scores.push(CLASS_ON)
          }
          //获取半星：超过0.5给半颗星，少于0.5不给
          const isHalf = score*10 - scoreIntger*10
          if(isHalf >= 5){
              scores.push(CLASS_HALF)
          }
          
          while(scores.length < 5){
              scores.push(CLASS_OFF)
          }
          
          return scores
       }
   }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import '../../common/stylus/mixins.styl';
                  .star
                    float left
                    font-size 0
                    .star-item
                      display inline-block
                      background-repeat no-repeat
                    &.star-48
                      .star-item
                        width 20px
                        height 20px
                        margin-right 22px
                        background-size 20px 20px
                        &:last-child
                          margin-right: 0
                        &.on
                          bg-image('./images/star48_on')
                        &.half
                          bg-image('./images/star48_half')
                        &.off
                          bg-image('./images/star48_off')
                    &.star-36
                      .star-item
                        width 15px
                        height 15px
                        margin-right 6px
                        background-size 15px 15px
                        &:last-child
                          margin-right 0
                        &.on
                          bg-image('./images/star36_on')
                        &.half
                          bg-image('./images/star36_half')
                        &.off
                          bg-image('./images/star36_off')
                    &.star-24
                      .star-item
                        width 10px
                        height 10px
                        margin-right 3px
                        background-size 10px 10px
                        &:last-child
                          margin-right 0
                        &.on
                          bg-image('./images/star24_on')
                        &.half
                          bg-image('./images/star24_half')
                        &.off
                          bg-image('./images/star24_off')
</style>
