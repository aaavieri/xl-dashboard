<template>
  <div class="login" id="login" @keyup.enter="login()">
    <div class="log-bg" :style="backStyle">
      <div class="log-cloud cloud1" :style="cloudStyle"></div>
      <div class="log-cloud cloud2" :style="cloudStyle"></div>
      <div class="log-cloud cloud3" :style="cloudStyle"></div>
      <div class="log-cloud cloud4" :style="cloudStyle"></div>

      <div class="log-logo">欢迎光临!</div>
      <div class="log-text">@小鲤基因</div>
    </div>
    <div class="log-email">
      <input type="text" placeholder="用户名" :class="'log-input' + (userId==''?' log-input-empty':'')" v-model="userId">
      <input type="password" placeholder="密码" :class="'log-input' + (password==''?' log-input-empty':'')"  v-model="password">
      <a :disabled="isLoging" class="log-btn" @click="login()">登录</a>
    </div>
    <Loading v-if="isLoging" marginTop="-30%"></Loading>
  </div>
</template>

<script>
  import Loading from './Loading.vue'
  import crypto from 'crypto'
  import swal from 'sweetalert2'
  export default {
    name: 'LoginBack',
    data(){
      return {
        isLoging: false,
        userId: '',
        password: ''
      }
    },
    components:{
      Loading
    },
    computed: {
      backStyle () {
        var imgUrl = require('src/assets/img/login-bg.jpg')
        return {
          background: `url(${imgUrl})`
        }
      },
      cloudStyle () {
        var imgUrl = require('src/assets/img/login-cloud.png')
        return {
          background: `url(${imgUrl})`
        }
      }
    },
    methods:{

      md5 (str) {
        str = str || ''
        var md5sum = crypto.createHash('md5');
        md5sum.update(str);
        str = md5sum.digest('hex');
        return str;
      },
      //登录逻辑
      login(){
        if(this.userId!='' && this.password!=''){
          this.toLogin();
        }
      },

      //登录请求
      toLogin () {

        //一般要跟后端了解密码的加密规则
        //这里例子用的哈希算法来自./js/sha1.min.js
        let password = this.md5( this.password );

        //设置在登录状态
        this.isLoging = true;

        var app = this

        this.$http.post('/users/login', {
          userId: this.userId,
          password
        }).then(response => {
          if (response.data.success) {
            this.$router.push('/showGlitch')
          } else {
            swal({
              title: '登录失败!',
              text: response.data.errMsg,
              type: 'success',
              confirmButtonClass: 'btn btn-success',
              confirmButtonText: 'OK',
              buttonsStyling: false
            }).then(() => {
              app.isLoging = false
              app.password = ''
            })
          }
        })

        //请求后端,比如:
        /*this.$http.post( 'example.com/login.php', {
            param: loginParam).then((response) => {
          if(response.data.code == 1){
            let expireDays = 1000 * 60 * 60 * 24 * 15;
            this.setCookie('session', response.data.session, expireDays);
            //登录成功后
            this.$router.push('/user_info');
          }
          }, (response) => {
              //Error
          });
            */
      }
    }
  }
</script>

<style scoped>
  .login{position: fixed; overflow: hidden;left: 50%; margin-left: -250px; top:50%; margin-top: -350px; width: 500px; min-height: 555px; z-index: 10; right: 140px; background: #fff;-webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    -ms-border-radius: 5px;
    -o-border-radius: 5px;
    border-radius: 5px; -webkit-box-shadow:  0px 3px 16px -5px #070707; box-shadow:  0px 3px 16px -5px #070707}
  .log-close{display: block; position: absolute; top:12px; right: 12px; opacity: 1;}
  .log-close:hover .icons{transform: rotate(180deg);}
  .log-close .icons{opacity: 1; transition: all .3s}
  .log-cloud{ width: 63px ;height: 40px; position: absolute; z-index: 1}
  .login .cloud1{top:21px; left: -30px; transform: scale(.6); animation: cloud1 20s linear infinite;}
  .login .cloud2{top:87px; right: 20px; animation: cloud2 19s linear infinite;}
  .login .cloud3{top:160px; left: 5px;transform: scale(.8);animation: cloud3 21s linear infinite;}
  .login .cloud4{top:150px; left: -40px;transform: scale(.4);animation: cloud4 19s linear infinite;}
  .log-bg{width: 100%; height: 312px; overflow: hidden;}
  .log-logo{height: 80px; margin: 120px auto 25px; text-align: center; color: #1fcab3; font-weight: bold; font-size: 40px;}
  .log-text{color: #57d4c3; font-size: 13px; text-align: center; margin: 0 auto;}
  .log-logo,.log-text{z-index: 2}
  .close{height:16px;width:16px;background-position:-13px 0;}
  .login-email{height:17px;width:29px;background-position:-117px 0;}

  .log-btns{padding: 15px 0; margin: 0 auto;}
  .log-btn{width:402px; display: block; text-align: left; line-height: 50px;margin:0 auto 15px; height:50px; color:#fff; font-size:13px;-webkit-border-radius: 5px; background-color: #3B5999;
    -moz-border-radius: 5px;
    -ms-border-radius: 5px;
    -o-border-radius: 5px;
    border-radius: 5px;
    position: relative;}
  .log-btn.tw{background-color: #13B4E9}
  .log-btn.email{background-color: #50E3CE}
  .log-btn:hover,.log-btn:focus{color: #fff; opacity: .8;}

  .log-email{text-align: center; margin-top: 20px;}
  .log-email .log-btn{background-color: #50E3CE;text-align: center;}
  .log-input-empty{border: 1px solid #f37474 !important;}
  .isloading{background: #d6d6d6}
  .log-btn .icons{margin-left: 30px; vertical-align: middle;}
  .log-btn .text{left: 95px; line-height: 50px; text-align: left; position: absolute;}
  .log-input{width: 370px;overflow: hidden; padding: 0 15px;font-size: 13px; border: 1px solid #EBEBEB; margin:0 auto 15px; height: 48px; line-height: 48px; -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    -ms-border-radius: 5px;
    -o-border-radius: 5px;
    border-radius: 5px;}
  .log-input.warn{border: 1px solid #f88787}

  @-webkit-keyframes cloud1 {
    0%{left: 200px}
    100%{left:-130px;}
  }
  @keyframes cloud1{
    0%{left: 200px}
    100%{left:-130px;}
  }

  @-webkit-keyframes cloud2 {
    0%{left:500px;}
    100%{left:-90px;}
  }
  @keyframes cloud2{
    0%{left:500px;}
    100%{left:-90px;}
  }

  @-webkit-keyframes cloud3 {
    0%{left:620px;}
    100%{left:-70px;}
  }
  @keyframes cloud3{
    0%{left:620px;}
    100%{left:-70px;}
  }@-webkit-keyframes cloud4 {
     0%{left:100px;}
     100%{left:-70px;}
   }
  @keyframes cloud4{
    0%{left:100px;}
    100%{left:-70px;}
  }

</style>
