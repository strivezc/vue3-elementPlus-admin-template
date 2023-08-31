<template>
  <div class="app-container">
    <el-table :data="tableData" border>
      <el-table-column align="center" label="序号" width="100">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="内容类型">
        <template #default="{row}">
          {{ resourceType[row.resourceType] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新日期" prop="createTime"></el-table-column>
      <el-table-column align="center" label="操作">
        <template #default="{row}">
          <el-button type="primary" plain size="small" @click="edit(row.resourceType)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup name="Agreement">
import { list } from '@/api'

const { proxy } = getCurrentInstance()

const resourceType = {
  34: '用户协议',
  35: '隐私协议',
  37: '常见问题',
};
const tableData=ref([{
  resourceType:34
}])

const getList=async ()=> {
  try {
    const { resultData } = await list();
    tableData.value = resultData;
  } catch (e) {
    console.log(e, 'error');
  }
}
function edit(resourceType) {
  proxy.$router.push('/operationsManage/editCompliance/' + resourceType);
}
</script>

<style scoped lang="scss">

</style>


