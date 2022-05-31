<template>
  <input type="text" v-model="note" v-emoji />
</template>

<script>

export default {
  name: 'Emoji', 
  data() {
    return {
      note: ''
    }
  }
}
</script>
