<template>
  <footer class="footer">
    <div class="container-fluid d-flex flex-wrap justify-content-between">
      <nav>
        <ul class="footer-menu">
          <li>
            <router-link :to="{path:'/showGlitch'}">欢迎光临</router-link>
          </li>
        </ul>
      </nav>
      <div class="copyright">
        &copy; {{year}}, 小鲤基因
      </div>
    </div>
  </footer>
</template>
<script>
  export default {
    data(){
      return {
        year: new Date().getFullYear()
      }
    }
  }

</script>
<style>

</style>



// WEBPACK FOOTER //
// src/pages/Dashboard/Layout/ContentFooter.vue
