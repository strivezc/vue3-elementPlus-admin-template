<template>
  <div>
    <el-dialog title="adadasd" draggable v-model="open" width="800px">
      弹窗
    </el-dialog>
    <el-button @click="open = true">打开弹窗</el-button>
    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </div>
</template>

<script setup>
const total = ref(51)
const queryParams = ref({
  pageNum: 10,
  pageSize: 1,
})
const open = ref(false)

function getList() {
  console.log('getList');
}
</script>
