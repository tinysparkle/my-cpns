<template>
  <div class="btns">
    <!-- 显示 -->
    <button v-permission="'1'">权限按钮(有权限)</button>
    <!-- 不显示 -->
    <button v-permission="'10'">权限按钮2</button>
  </div>
</template>

<script>
  export default {
    name: 'Permission'
  }
</script>
