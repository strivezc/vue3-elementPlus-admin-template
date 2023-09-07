<template>
  <div class="app-container">
    <userAvatar></userAvatar>
  </div>
</template>

<script setup name="User">
import userAvatar from './userAvatar'
const state = reactive({
  queryParams: {
    postCode: ''
  }
})
const { queryParams } = toRefs(state)
</script>

<style scoped lang="scss"></style>
