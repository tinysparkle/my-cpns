<template>
  <button v-debounce="debounceClick">防抖</button>
</template>

<script>
export default {
  name: 'Debounce',
  methods: {
    debounceClick () {
      console.log('只触发一次')
    }
  }
}
</script>
