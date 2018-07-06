<template>
  <router-view :dataType="dataType"></router-view>
</template>

<script>
export default {
  name: 'MedicalData',
  data () {
    return {
      dataType: 1
    }
  }
}
</script>

<style scoped>

</style>
