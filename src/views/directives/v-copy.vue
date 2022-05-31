<template>
  <div>
    <button v-copy="value">Copy</button>
  </div>
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
