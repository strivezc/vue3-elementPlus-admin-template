<template>
  <div class="total-count">
    共有 <span class="red">{{ props.total }}</span> 条记录
  </div>
</template>

<script setup name="TotalCount">
const props = defineProps({
  total: {
    type: [Number, String]
  }
})
</script>

<style scoped lang="scss">
.total-count {
  font-size: 13px;
  height: 28px;
  line-height: 28px;
  font-weight: 400;
  color: #606266;
  margin-top: -10px;
}
.red {
  color: #ff574e;
}
</style>
