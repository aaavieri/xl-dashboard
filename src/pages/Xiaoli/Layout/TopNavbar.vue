<template>
  <navbar :show-navbar="showNavbar">
    <div class="navbar-wrapper">
      <div class="navbar-toggle" :class="{toggled: $sidebar.showSidebar}">
        <navbar-toggle-button @click.native="toggleSidebar">
        </navbar-toggle-button>
      </div>
      <a class="navbar-brand" href="#pablo">
        {{$route.name}}
      </a>
    </div>
    <button @click="toggleNavbar" class="navbar-toggler" type="button" data-toggle="collapse"
            data-target="#navigation"
            aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-bar navbar-kebab"></span>
      <span class="navbar-toggler-bar navbar-kebab"></span>
      <span class="navbar-toggler-bar navbar-kebab"></span>
    </button>

    <template slot="navbar-menu">

      <form>
        <div class="input-group no-border">
          <fg-input placeholder="Search..." addon-right-icon="now-ui-icons ui-1_zoom-bold">
          </fg-input>
        </div>
      </form>

      <ul class="navbar-nav">
        <!--<li class="nav-item">-->
          <!--<a class="nav-link" href="#pablo">-->
            <!--<i class="now-ui-icons media-2_sound-wave"></i>-->
            <!--<p>-->
              <!--<span class="d-lg-none d-md-block">Stats</span>-->
            <!--</p>-->
          <!--</a>-->
        <!--</li>-->
        <drop-down tag="li"
                   position="right"
                   class="nav-item"
                   icon="now-ui-icons users_single-02">

          <a class="dropdown-item" href="#" @click="logout()">注销</a>
          <!--<a class="dropdown-item" href="#">Another action</a>-->
          <!--<a class="dropdown-item" href="#">Something else here</a>-->
        </drop-down>

        <!--<li class="nav-item">-->
          <!--<a class="nav-link" href="#pablo">-->
            <!--<i class="now-ui-icons users_single-02"></i>-->
            <!--<p>-->
              <!--<span class="d-lg-none d-md-block">Account</span>-->
            <!--</p>-->
          <!--</a>-->
        <!--</li>-->
      </ul>

    </template>
  </navbar>
</template>
<script>
  import {RouteBreadcrumb, Navbar, NavbarToggleButton} from 'src/components';
  import {CollapseTransition} from 'vue2-transitions'
  import swal from 'sweetalert2'

  export default {
    components: {
      RouteBreadcrumb,
      Navbar,
      NavbarToggleButton,
      CollapseTransition
    },
    computed: {
      routeName() {
        const {name} = this.$route
        return this.capitalizeFirstLetter(name)
      }
    },
    data() {
      return {
        activeNotifications: false,
        showNavbar: false
      }
    },
    methods: {
      capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      },
      toggleNotificationDropDown() {
        this.activeNotifications = !this.activeNotifications
      },
      closeDropDown() {
        this.activeNotifications = false
      },
      toggleSidebar() {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
      },
      toggleNavbar() {
        this.showNavbar = !this.showNavbar;
      },
      hideSidebar() {
        this.$sidebar.displaySidebar(false)
      },
      logout () {
        var app = this
        this.$http.post('/users/logout').then(response => {
          if (!response.data.success) {
            swal({
              title: '注销失败，请直接关闭页面!',
              text: response.data.errMsg,
              timer: 2000,
              showConfirmButton: false
            })
          } else {
            swal({
              title: '注销成功!',
              type: 'success',
              confirmButtonClass: 'btn btn-success',
              confirmButtonText: 'OK',
              buttonsStyling: false
            }).then(() => {
              app.$dictionary.clear()
              app.$router.push('/loginBack')
            })
          }
      })
      }
    }
  }

</script>
<style>

</style>



// WEBPACK FOOTER //
// src/pages/Dashboard/Layout/TopNavbar.vue
