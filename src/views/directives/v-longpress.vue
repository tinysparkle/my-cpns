<template>
  <button v-longpress="longpress">长按</button>
</template>

<script>
export default {
  name: 'Longpress',
  methods: {
    longpress () {
      alert('长按指令生效')
    }
  }
}
</script>
