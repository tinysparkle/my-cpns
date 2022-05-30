<template>
  <div class="box">
    <button v-copy="value">copy</button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value: '随便写点文本'
      }
    }
  }
</script>

<style lang="less" scoped>
.box {
  width: 200px;
  height: 200px;
}
</style>