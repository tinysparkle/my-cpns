<template>
  <div>
    <input type="text" v-model="note" v-emoji />
  </div>
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
