<template>
  <div class="el-dialog" v-draggable>可拖拽</div>
</template>

<script>
  export default {
    name: 'Draggable'
  }
</script>

<style lang="less" scoped>
.el-dialog {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 200px;
  width: 200px;
  background-color: darkorange;
}
</style>