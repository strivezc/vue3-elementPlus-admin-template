<template>
  <div class="app-container home">
    <div v-permission="1">baseApi：{{ baseApi }}</div>
    <div v-permission="3000">baseApi：{{ baseApi }}</div>
  </div>
</template>

<script setup name="Index">
const baseApi = import.meta.env.VITE_APP_BASE_API
</script>

<style scoped lang="scss"></style>
