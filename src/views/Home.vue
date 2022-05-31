<template>
  <div class="home-page">
    <el-button @click="toDirectivePage">指令演示</el-button>
  </div>
</template>

<script>
  
  export default {
    methods: {
      toDirectivePage() {
        this.$router.push('/show-directives')
      }
    }
  }
</script>
