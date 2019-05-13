<template>
    <section class="loginContainer">
      <div class="loginInner">
        <div class="login_header">
          <h2 class="login_logo">硅谷外卖</h2>
          <div class="login_header_title">
            <a href="javascript:;" :class="{on:loginType === 0}" @click="loginType = 0">短信登录</a>
            <a href="javascript:;" :class="{on:loginType === 1}" @click="loginType = 1">密码登录</a>
          </div>
        </div>
        <div class="login_content">
          <form>
            <div :class="{on:loginType === 0}">
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
                <button :disabled="!isPhone" class="get_verification" :class="{isPhone: isPhone}" @click.prevent="getCode">
                  {{countdownTime > 0? `已发送（${countdownTime}s）`:'获取验证码'}}
                </button>
              </section>
              <section class="login_verification">
                <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
              </section>
              <section class="login_hint">
                温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
                <a href="javascript:;">《用户服务协议》</a>
              </section>
            </div>
            <div :class="{on:loginType === 1}">
              <section>
                <section class="login_message">
                  <input type="tel" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
                </section>
                <section class="login_verification">
                  <input :type="showPwd ? 'text':'password'" maxlength="8" placeholder="密码" v-model="pwd">
                  <div class="switch_button" :class="showPwd?'on':'off'" @click="showPwd = !showPwd">
                    <div class="switch_circle" :class="{right:showPwd}"></div>
                    <span class="switch_text">{{showPwd?'abc':'...'}}</span>
                  </div>
                </section>
                <section class="login_message">
                  <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                  <img class="get_verification" src="http://localhost:4000/captcha" alt="captcha" ref="captcha"
                  @click="getCaptcha" >
                </section>
              </section>
            </div>
            <button class="login_submit" @click.prevent="login">登录</button>
          </form>
          <a href="javascript:;" class="about_us">关于我们</a>
        </div>
        <a href="javascript:" class="go_back" @click="$router.back()">
          <i class="iconfont icon-jiantou2"></i>
        </a>
      </div>
      <!-- 必须要放在secition里面，不然vue会报错：一个component只能有一个template -->
      <AlertTips :alertText="alertText" v-show="isShowAlert" @closeTip="closeTip" />
    </section>
</template>

<script>
import AlertTips from '../../components/AlertTips/AlertTips.vue'
import {reqSendCode, reqSmsLogin, reqPwdLogin} from '../../api'

export default {
  data(){
    return {
      loginType : 0, //0.短信登录，1.密码登录
      countdownTime: 0, //倒计时时间
      phone:'',  //手机号码
      pwd:'',
      showPwd:false,
      captcha:'', //图形验证码
      code:'', //验证码
      name:'', // 用户名
      alertText: '',
      isShowAlert: false
    }
  },
  components:{
    AlertTips
  },

  computed:{
    isPhone(){
      //计算是否输入正确的手机号码
      return /^[1][3,4,5,7,8][0-9]{9}$/.test(this.phone);
    }
  },

  methods: {
    async getCode(){
      //1.判断是否开启计时
     
      let sendCodeInt
      if(!this.countdownTime){
        this.countdownTime = 30
        // 这里需要用this指定当前实例的countdownTime, 需要使用箭头函数，否则this会指向当前methods对象
        this.sendCodeInt = setInterval(() =>{
          this.countdownTime--
          if(this.countdownTime <= 0){
            clearInterval(this.sendCodeInt)
          }
        },1000)

        //发送ajax请求验证码
        const result = await reqSendCode(this.phone)
        if(result.code === 1){
          const msg = result.msg
          this.showAlert(msg)
          //关闭定时器
          if(this.countdownTime){
            this.countdownTime = 0
            clearInterval(this.sendCodeInt)
            this.sendCodeInt = undefined
          }
         
        }
      }

    },

    //先验证，后发送
    async login(){

      let result 

      if(this.loginType === 0){//短信
        const {isPhone, phone, code} = this
        if(!isPhone){
          this.showAlert('手机号码不正确');
          return;
        }else if(!/^\d{6}$/.test(code)){
          this.showAlert('验证码必须是6位数字')
          return;
        }

        result = await reqSmsLogin(phone, code)

      } else{ //用户名
        const {name, pwd, captcha} = this

        if(!name){
          this.showAlert('用户名必须指定');
          return;
        }else if(!pwd){
          this.showAlert('密码必须指定');
          return;
        }else if(!captcha){
          this.showAlert('验证码必须指定');
          return;
        }

        result = await reqPwdLogin(name, pwd, captcha)

      }

      if(this.countdownTime){
        this.countdownTime = 0
        clearInterval(this.sendCodeInt)
        this.sendCodeInt = undefined
      }

      if(result.code === 1){
        this.getCaptcha()
        let msg = result.msg
        this.showAlert(msg)
      }else{
        //记录用户信息
        const user = result.data
        this.$store.dispatch('recordUser',user)
        //登录成功，路由跳转到个人中心
        this.$router.replace('/person')
      }
      
    },

    showAlert(alertText){
      this.alertText = alertText
      this.isShowAlert = true
    },

    closeTip(){
      this.alertText = ''
      this.isShowAlert = false
    },

    //获取动态图形验证码
    getCaptcha(){
      //防止缓存,src没有跨域问题，不是ajax请求
      this.$refs.captcha.src = 'http://localhost:4000/captcha?time='+Date.now()
    }

  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import '../../common/stylus/mixins.styl'
    .loginContainer
      width 100%
      height 100%
      background #fff
      .loginInner
        padding-top 60px
        width 80%
        margin 0 auto
        .login_header
          .login_logo
            font-size 40px
            font-weight bold
            color #02a774
            text-align center
          .login_header_title
            padding-top 40px
            text-align center
            >a
              color #333
              font-size 14px
              padding-bottom 4px
              &:first-child
                margin-right 40px
              &.on
                color #02a774
                font-weight 700
                border-bottom 2px solid #02a774
        .login_content
          >form
            >div
              display none
              &.on
                display block
              input
                width 100%
                height 100%
                padding-left 10px
                box-sizing border-box
                border 1px solid #ddd
                border-radius 4px
                outline 0
                font 400 14px Arial
                &:focus
                  border 1px solid #02a774
              .login_message
                position relative
                margin-top 16px
                height 48px
                font-size 14px
                background #fff
                .get_verification
                  position absolute
                  top 50%
                  right 10px
                  transform translateY(-50%)
                  border 0
                  color #ccc
                  font-size 14px
                  background transparent
                  &.isPhone
                    color black
              .login_verification
                position relative
                margin-top 16px
                height 48px
                font-size 14px
                background #fff
                .switch_button
                  font-size 12px
                  border 1px solid #ddd
                  border-radius 8px
                  transition background-color .3s,border-color .3s
                  padding 0 6px
                  width 30px
                  height 16px
                  line-height 16px
                  color #fff
                  position absolute
                  top 50%
                  right 10px
                  transform translateY(-50%)
                  &.off
                    background #fff
                    .switch_text
                      float right
                      color #ddd
                  &.on
                    background #02a774
                  >.switch_circle
                    //transform translateX(27px)
                    position absolute
                    top -1px
                    left -1px
                    width 16px
                    height 16px
                    border 1px solid #ddd
                    border-radius 50%
                    background #fff
                    box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                    transition transform .3s
                    &.right
                      transform  translateX(27px)
              .login_hint
                margin-top 12px
                color #999
                font-size 14px
                line-height 20px
                >a
                  color #02a774
            .login_submit
              display block
              width 100%
              height 42px
              margin-top 30px
              border-radius 4px
              background #4cd96f
              color #fff
              text-align center
              font-size 16px
              line-height 42px
              border 0
          .about_us
            display block
            font-size 12px
            margin-top 20px
            text-align center
            color #999
        .go_back
          position absolute
          top 5px
          left 5px
          width 30px
          height 30px
          >.iconfont
            font-size 20px
            color #999
</style>
