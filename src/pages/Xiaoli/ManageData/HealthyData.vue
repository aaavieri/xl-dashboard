<template>
  <router-view :dataType="dataType"></router-view>
</template>

<script>
export default {
  name: 'HealthyData',
  data () {
    return {
      dataType: 2
    }
  }
}
</script>

<style scoped>

</style>
