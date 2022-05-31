<template>
  <button v-copy="value">Copy</button>
</template>

<script>
  export default {
    name: 'Copy',
    data() {
      return {
        value: '随便写点文本'
      }
    }
  }
</script>
