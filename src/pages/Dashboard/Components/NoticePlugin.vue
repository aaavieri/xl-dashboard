<template>
  <div class="notice-plugin" v-click-outside="closeDropDown">
    <div class="dropdown show-dropdown" :class="{show: isOpen}">
      <a data-toggle="dropdown" @click="toggleDropDown">
        <slot name="closePart">
          <i class="el-icon-question fa-3x"></i>
        </slot>
      </a>
      <transition
        v-on:before-enter="beforeEnter"
        v-on:enter="enter"
        :css="false">
        <ul class="dropdown-menu show" v-if="isOpen" style="min-width: 0px">
          <li class="header-title" v-show="showContent">{{title}}</li>
          <transition name="test" enter-active-class="zoomInRight" leave-active-class="zoomOutRight" >
            <li class="content text-left" v-show="showContent">
              <slot/>
            </li>
          </transition>
        </ul>
      </transition>
    </div>
  </div>
</template>
<script>

  import velocity from 'velocity-animate'
  export default {
    name: 'NoticePlugin',
    props: {
      title: {
        type: String
      },
      open: {
        type: Boolean,
        default: false
      },
      width: Number
    },
    data () {
      return {
        isOpen: false,
        showContent: true
      }
    },
    methods: {
      toggleDropDown () {
        this.isOpen = !this.isOpen
      },
      closeDropDown () {
        this.isOpen = false
      },
      beforeEnter (el) {
        el.style.opacity = 0
        el.style.width = this.pluginWidth.width
      },
      enter (el, done) {
        let realHeight = el.offsetHeight
        this.showContent = false
        el.style.width = '0px'
        el.style.height = '0px'
        el.style.opacity = 1
        let {width} = this.pluginWidth
        Velocity(el,
          { height: realHeight, width: width },
          { complete: () => {
              this.showContent = true
              done()
            }, duration: 800, delay: 200 }
        )
      }
    },
    computed: {
      pluginWidth () {
        if (this.width && this.width > 0) {
          return {width: `${this.width}px`}
        } else {
          return {}
        }
      }
    },
    mounted () {
      this.isOpen = this.open
    }
  }
</script>
<style>
  .notice-plugin {
    position: fixed;
    right: 0;
    width: 64px;
    background: rgba(0,0,0,.3);
    z-index: 1031;
    border-radius: 8px 0 0 8px;
    text-align: center;
    top: 120px
  }

  .notice-plugin .badge,.notice-plugin .el-tag,.notice-plugin li>a {
    transition: all .34s;
    -webkit-transition: all .34s;
    -moz-transition: all .34s
  }

  .notice-plugin .fa-cog {
    color: #fff;
    padding: 10px;
    border-radius: 0 0 6px 6px;
    width: auto
  }

  .notice-plugin .dropdown-menu {
    right: 80px;
    left: auto!important;
    top: -52px!important;
    /*width: 0px;*/
    border-radius: .1875rem;
    padding: 0 10px
  }

  .notice-plugin .dropdown .dropdown-menu .now-ui-icons {
    top: 5px
  }

  .notice-plugin .dropdown-menu:after,.notice-plugin .dropdown-menu:before {
    right: 10px;
    margin-left: auto;
    left: auto
  }

  .notice-plugin .fa-circle-thin {
    color: #fff
  }

  .notice-plugin .active .fa-circle-thin {
    color: #0bf
  }

  .notice-plugin .dropdown-menu>.active>a,.notice-plugin .dropdown-menu>.active>a:focus,.notice-plugin .dropdown-menu>.active>a:hover {
    color: #777;
    text-align: center
  }

  .notice-plugin img {
    border-radius: 0;
    width: 100%;
    height: 100px;
    margin: 0 auto
  }

  .notice-plugin .dropdown-menu li>a:focus,.notice-plugin .dropdown-menu li>a:hover {
    box-shadow: none
  }

  .notice-plugin .badge,.notice-plugin .el-tag {
    border: 3px solid #fff;
    border-radius: 50%;
    cursor: pointer;
    display: inline-block;
    height: 23px;
    margin-right: 5px;
    position: relative;
    width: 23px
  }

  .notice-plugin .active.el-tag,.notice-plugin .badge.active,.notice-plugin .badge:hover,.notice-plugin .el-tag:hover {
    border-color: #0bf
  }

  .notice-plugin .badge-blue {
    background-color: #2ca8ff
  }

  .notice-plugin .badge-green {
    background-color: #18ce0f
  }

  .notice-plugin .badge-orange {
    background-color: #f96332
  }

  .notice-plugin .badge-yellow {
    background-color: #ffb236
  }

  .notice-plugin .badge-red {
    background-color: #ff3636
  }

  .notice-plugin .badge-black {
    background-color: #212120
  }

  .notice-plugin h5 {
    font-size: 14px;
    margin: 10px
  }

  .notice-plugin .dropdown-menu li {
    display: block;
    padding: 18px 2px;
    width: 25%;
    float: left
  }

  .notice-plugin li.adjustments-line,.notice-plugin li.button-container,.notice-plugin li.header-title {
    width: 100%;
    height: 50px;
    min-height: inherit
  }

  .notice-plugin li.button-container {
    height: auto
  }

  .notice-plugin li.button-container div {
    margin-bottom: 5px
  }

  .notice-plugin #sharrreTitle {
    text-align: center;
    padding: 10px 0;
    height: 50px
  }

  .notice-plugin li.header-title {
    height: 30px;
    line-height: 25px;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    text-transform: uppercase
  }

  .notice-plugin .adjustments-line p {
    float: left;
    display: inline-block;
    margin-bottom: 0;
    font-size: 1em;
    color: #3c4858
  }

  .notice-plugin .adjustments-line a {
    color: transparent
  }

  .notice-plugin .adjustments-line a .badge-colors {
    position: relative;
    top: -2px
  }

  .notice-plugin .adjustments-line a a:focus,.notice-plugin .adjustments-line a a:hover {
    color: transparent
  }

  .notice-plugin .adjustments-line .togglebutton {
    text-align: center
  }

  .notice-plugin .adjustments-line .togglebutton .label-switch {
    position: relative;
    left: -10px;
    font-size: .7142em;
    color: #888
  }

  .notice-plugin .adjustments-line .togglebutton .label-switch.label-right {
    left: 10px
  }

  .notice-plugin .adjustments-line .togglebutton .toggle {
    margin-right: 0
  }

  .notice-plugin .adjustments-line .dropdown-menu>li.adjustments-line>a {
    padding-right: 0;
    padding-left: 0;
    border-bottom: 1px solid #ddd;
    border-radius: 0;
    margin: 0
  }

  .notice-plugin .dropdown-menu>li>a.img-holder {
    font-size: 16px;
    text-align: center;
    border-radius: 10px;
    background-color: #fff;
    border: 3px solid #fff;
    padding-left: 0;
    padding-right: 0;
    opacity: 1;
    cursor: pointer;
    display: block;
    max-height: 100px;
    overflow: hidden;
    padding: 0
  }

  .notice-plugin .dropdown-menu>li>a.img-holder img {
    margin-top: auto
  }

  .notice-plugin .dropdown-menu>li>a.switch-trigger:focus,.notice-plugin .dropdown-menu>li a.switch-trigger:hover {
    background-color: transparent
  }

  .notice-plugin .dropdown-menu>li:focus>a.img-holder,.notice-plugin .dropdown-menu>li:hover>a.img-holder {
    border-color: rgba(0,187,255,.53)
  }

  .notice-plugin .dropdown-menu>.active>a.img-holder {
    border-color: #0bf;
    background-color: #fff
  }

  .notice-plugin .btn-social {
    width: 50%;
    display: block;
    width: 48%;
    float: left;
    font-weight: 600
  }

  .notice-plugin .btn-social i {
    margin-right: 5px
  }

  .notice-plugin .btn-social:first-child {
    margin-right: 2%
  }

  .notice-plugin .dropdown .dropdown-menu {
    transform: translateY(-15%);
    top: 27px;
    opacity: 0;
    transform-origin: 0 0
  }

  .notice-plugin .dropdown .dropdown-menu:before {
    border-bottom: .4em solid transparent;
    border-left: .4em solid rgba(0,0,0,.2);
    border-top: .4em solid transparent;
    right: -16px;
    top: 46px
  }

  .notice-plugin .dropdown .dropdown-menu:after {
    border-bottom: .4em solid transparent;
    border-left: .4em solid #fff;
    border-top: .4em solid transparent;
    right: -16px
  }

  .notice-plugin .dropdown .dropdown-menu:after,.notice-plugin .dropdown .dropdown-menu:before {
    content: "";
    display: inline-block;
    position: absolute;
    top: 74px;
    width: 16px;
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%)
  }

  .notice-plugin .dropdown.show .dropdown-menu {
    opacity: 1;
    transform: translateY(-13%);
    transform-origin: 0 0
  }

  .notice-plugin .bootstrap-switch {
    margin: 0
  }

  .button-container .btn {
    margin-right: 10px;
  }

  .content {
    width: 100%!important;
    min-height: inherit;
    font-size: 12px;
  }

</style>



// WEBPACK FOOTER //
// src/pages/Dashboard/Layout/Extra/SidebarSharePlugin.vue
