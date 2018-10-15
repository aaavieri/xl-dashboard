<template>
  <div class="wrapper" :class="{'nav-open': $sidebar.showSidebar}" id="page">
    <notifications></notifications>
    <side-bar :background-color="sidebarBackground" :title="title" :logo="logo">
      <template slot-scope="props" slot="links">
        <!--<user-menu></user-menu>-->
        <sidebar-item :link="{name: '欢迎光临小鲤基因', icon: 'now-ui-icons emoticons_satisfied', path: '/showGlitch'}">
        </sidebar-item>
        <sidebar-item :link="{name: '数据管理', icon: 'mintui mintui-iconset0358', path: '/manageData'}">
          <sidebar-item :link="{name: '医疗版', path: '/manageData/medicalData'}"></sidebar-item>
          <sidebar-item :link="{name: '大健康', path: '/manageData/healthyData'}"></sidebar-item>
          <sidebar-item :link="{name: '商城', path: '/manageData/goodsData'}"></sidebar-item>
        </sidebar-item>
        <!--<sidebar-item :link="{name: 'Pages', icon: 'now-ui-icons design_image'}">-->
          <!--<sidebar-item :link="{name: 'Pricing', path: '/pricing'}"></sidebar-item>-->
          <!--<sidebar-item :link="{name: 'Timeline', path: '/pages/timeline'}"></sidebar-item>-->
          <!--<sidebar-item :link="{name: 'Login', path: '/login'}"></sidebar-item>-->
          <!--<sidebar-item :link="{name: 'Register', path: '/register'}"></sidebar-item>-->
          <!--<sidebar-item :link="{name: 'Lock Screen', path: '/lock'}"></sidebar-item>-->
          <!--<sidebar-item :link="{name: 'User Profile', path: '/pages/user'}"></sidebar-item>-->
        <!--</sidebar-item>-->
        <!--<sidebar-item :link="{name: 'Components', icon: 'now-ui-icons education_atom'}">-->
          <!--<sidebar-item :link="{name: 'Buttons', path: '/components/buttons'}"></sidebar-item>-->
          <!--<sidebar-item :link="{name: 'Grid System', path: '/components/grid-system'}"></sidebar-item>-->
          <!--<sidebar-item :link="{name: 'Panels', path: '/components/panels'}"></sidebar-item>-->
          <!--<sidebar-item :link="{name: 'Sweet Alert', path: '/components/sweet-alert'}"></sidebar-item>-->
          <!--<sidebar-item :link="{name: 'Notifications', path: '/components/notifications'}"></sidebar-item>-->
          <!--<sidebar-item :link="{name: 'Icons', path: '/components/icons'}"></sidebar-item>-->
          <!--<sidebar-item :link="{name: 'Typography', path: '/components/typography'}"></sidebar-item>-->
        <!--</sidebar-item>-->
        <!--<sidebar-item :link="{name: 'Forms', icon: 'now-ui-icons files_single-copy-04'}">-->
          <!--<sidebar-item :link="{name: 'Regular Forms', path: '/forms/regular'}"></sidebar-item>-->
          <!--<sidebar-item :link="{name: 'Extended Forms', path: '/forms/extended'}"></sidebar-item>-->
          <!--<sidebar-item :link="{name: 'Validation Forms', path: '/forms/validation'}"></sidebar-item>-->
          <!--<sidebar-item :link="{name: 'Wizard', path: '/forms/wizard'}"></sidebar-item>-->
        <!--</sidebar-item>-->
        <!--<sidebar-item :link="{name: 'Tables', icon: 'now-ui-icons design_bullet-list-67'}">-->
          <!--<sidebar-item :link="{name: 'Regular Tables', path: '/table-list/regular'}"></sidebar-item>-->
          <!--<sidebar-item :link="{name: 'Extended Tables', path: '/table-list/extended'}"></sidebar-item>-->
          <!--<sidebar-item :link="{name: 'Paginated Tables', path: '/table-list/paginated'}"></sidebar-item>-->
        <!--</sidebar-item>-->
        <!--<sidebar-item :link="{name: 'Maps', icon: 'now-ui-icons location_pin'}">-->
          <!--<sidebar-item :link="{name: 'Google Maps', path: '/maps/google'}"></sidebar-item>-->
          <!--<sidebar-item :link="{name: 'Full Screen Maps', path: '/maps/full-screen'}"></sidebar-item>-->
          <!--<sidebar-item :link="{name: 'Vector Maps', path: '/maps/vector-map'}"></sidebar-item>-->
        <!--</sidebar-item>-->
        <!--<sidebar-item-->
          <!--:link="{name: 'Widgets', icon: 'now-ui-icons objects_diamond', path: '/widgets'}"></sidebar-item>-->
        <!--<sidebar-item-->
          <!--:link="{name: 'Charts', icon: 'now-ui-icons business_chart-pie-36', path: '/charts'}"></sidebar-item>-->
        <!--<sidebar-item-->
          <!--:link="{name: 'Calendar', icon: 'now-ui-icons media-1_album', path: '/calendar'}"></sidebar-item>-->

      </template>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>
      <!--<sidebar-share :color.sync="sidebarBackground"-->
                     <!--:fixed-navbar.sync="fixedNavbar"-->
                     <!--:sidebarMini.sync="sidebarMini">-->
      <!--</sidebar-share>-->
      <router-view name="header"></router-view>

      <div :class="{content: !$route.meta.hideContent}" @click="toggleSidebar">
        <zoom-center-transition :duration="200" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </zoom-center-transition>
      </div>
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-new */
  import PerfectScrollbar from 'perfect-scrollbar'
  import 'perfect-scrollbar/css/perfect-scrollbar.css'
  import SidebarShare from './Extra/SidebarSharePlugin'

  function hasElement (className) {
    return document.getElementsByClassName(className).length > 0;
  }

  function initScrollbar (className) {
    if (hasElement(className)) {
      new PerfectScrollbar(`.${className}`);
    } else {
      // try to init it later in case this component is loaded async
      setTimeout(() => {
        initScrollbar(className);
      }, 100);
    }
  }

  import TopNavbar from './TopNavbar.vue'
  import ContentFooter from './ContentFooter.vue'
  import DashboardContent from './Content.vue'
  import MobileMenu from './Extra/MobileMenu.vue'
  import UserMenu from './Extra/UserMenu.vue'
  import {SlideYDownTransition, ZoomCenterTransition} from 'vue2-transitions'
  import swal from 'sweetalert2'

  export default {
    name: 'XiaoliLayout',
    components: {
      TopNavbar,
      ContentFooter,
      DashboardContent,
      MobileMenu,
      UserMenu,
      SlideYDownTransition,
      ZoomCenterTransition,
      SidebarShare
    },
    data () {
      return {
        title: '小鲤基因',
        logo: require('@/assets/img/logo.jpg'),
        sidebarBackground: 'black',
        fixedNavbar: false,
        sidebarMini: false
      }
    },
    methods: {
      toggleSidebar () {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false)
        }
      },
      minimizeSidebar () {
        if (this.$sidebar) {
          this.$sidebar.toggleMinimize()
          let text = this.$sidebar.isMinimized ? 'activated' : 'deactivated';
          this.$notify({type: 'info', message: `Sidebar mini ${text}...`})
        }
      },
      checkLogin () {
        var app = this
        this.$http.post('/users/checkLogin').then(response => {
          if (!response.data.success) {
            swal({
              title: '请求错误!',
              text: response.data.errMsg,
              type: 'error',
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              app.$router.push('/loginBack')
            })
          }
        })
      }
    },
    mounted () {
      this.checkLogin()
      this.$dictionary.initData(this.$http)
      let docClasses = document.body.classList;
      let isWindows = navigator.platform.startsWith('Win');
      if (isWindows) {
        // if we are on windows OS we activate the perfectScrollbar function
        initScrollbar('sidebar');
        initScrollbar('sidebar-wrapper');

        docClasses.add('perfect-scrollbar-on')
      } else {
        docClasses.add('perfect-scrollbar-off')
      }
    },
    watch: {
      sidebarMini () {
        this.minimizeSidebar()
      }
    }
  }
</script>

<style lang="scss" scoped>
  $scaleSize: .95;
  @keyframes zoomIn95 {
    from {
      opacity: 0;
      transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }
    to {
      opacity: 1;
    }
  }
  .main-panel .zoomIn {
    animation-name: zoomIn95;
  }
  @keyframes zoomOut95 {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
      transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }
  }
  .main-panel .zoomOut {
    animation-name: zoomOut95;
  }
</style>
