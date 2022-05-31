<template>
  <div class="waterMarker" v-waterMarker="{text:'版权所有',textColor:'rgba(180, 180, 180, 0.4)'}"></div>
</template>

<script>
  export default {
    name: 'WaterMarker'
  }
</script>

<style lang="less">
.waterMarker {
  height: 200px;
}
</style>