<template>
  <div class="box">
    <img v-lazyload="require('@/assets/img/1.png')" alt="">
    <img v-lazyload="require('@/assets/img/2.png')" alt="">
    <img v-lazyload="require('@/assets/img/3.png')" alt="">
    <img v-lazyload="require('@/assets/img/4.png')" alt="">
  </div>
</template>

<script>
  export default {
    name: 'Lazyload'
  }
</script>

<style lang="less" scoped>

</style>