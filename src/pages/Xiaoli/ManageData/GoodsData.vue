<template>
  <router-view :dataType="dataType"></router-view>
</template>

<script>
export default {
  name: 'GoodsData',
  data () {
    return {
      dataType: 3
    }
  }
}
</script>

<style scoped>

</style>
