<template>
  <div class="app-container">
    <el-table :data="tableData" border>
      <el-table-column align="center" label="序号" width="100">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="内容类型">
        <template #default="{ row }">
          {{ resourceType[row.type] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新日期" prop="updateTime"></el-table-column>
      <el-table-column align="center" label="操作">
        <template #default="{ row }">
          <el-button type="primary" plain size="small" @click="edit(row.type)" v-permission="'3001'"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup name="Agreement">
const { proxy } = getCurrentInstance()

const resourceType = {
  1: '免责声明',
  2: '用户协议',
  3: '隐私协议',
  4: '儿童隐私协议',
  5: '接单规则',
  6: '提现规则',
  7: '等级解锁攻略',
  8: '发布悬赏须知'
}
const tableData = ref([])

const getList = async () => {
  try {
    const { data } = await proxy.$http.operation.queryAgreement()
    tableData.value = data
  } catch (e) {
    console.log(e, 'error')
  }
}
function edit(resourceType) {
  proxy.$router.push('/operationsManage/editCompliance/' + resourceType)
}
getList()
</script>

<style scoped lang="scss"></style>
