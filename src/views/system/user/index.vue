<template>
  <div class="app-container">
    <userAvatar></userAvatar>
  </div>
</template>

<script setup name="User">
  import userAvatar from './userAvatar'
  const data=reactive({
    queryParams:{
      postCode:''
    }
  })
  const { queryParams} = toRefs(data);
</script>
