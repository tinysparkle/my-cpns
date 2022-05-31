<template>
  <div style="width: 300px">
    <el-input v-number="'positive'" v-model="value" placeholder="限制输入类型"></el-input>
  </div>
</template>

<script>
  export default {
    name: 'Number',
    data() {
      return {
        value: ''
      }
    }
  }
</script>

