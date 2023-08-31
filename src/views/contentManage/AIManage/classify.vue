<template>
  <div class="app-container">
    <el-form
      :inline="true"
      class="form-border"
      autocomplete="on"
      :model="formData"
      onsubmit="return false"
    >
      <el-row>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="分类名称">
            <el-input v-model="formData.accountName" placeholder="分类名称" class="input" />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio label="">全部</el-radio>
              <el-radio :label="0">正常</el-radio>
              <el-radio :label="1">删除</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item>
            <el-button type="primary" native-type="submit" @click="getList">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="ID" prop="createTime"></el-table-column>
        <el-table-column align="center" label="名称" prop="createTime"></el-table-column>
        <el-table-column align="center" label="排序" prop="createTime"></el-table-column>
        <el-table-column align="center" label="状态" prop="createTime"></el-table-column>
        <el-table-column align="center" label="操作" prop="createTime"></el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="listQuery.currPage"
        v-model:limit="listQuery.pageSize"
        @pagination="getList"
      />
    </div>
    <el-dialog title="编辑" draggable v-model="showDialog" :before-close="close" width="450px">
      <el-form
        :model="form"
        :rules="formRules"
        ref="ruleFormRef"
        label-position="right"
        label-width="70px"
      >
        <el-form-item label="名称:" prop="accountName">
          <el-input v-model="form.accountName" placeholder="名称" class="input form-input" />
        </el-form-item>
        <el-form-item label="排序:">
          <el-select class="form-select" v-model="form.topic" placeholder="请选择">
            <el-option label="全部" value="" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="submit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Classify">
import { list } from '@/api'

const { proxy } = getCurrentInstance()

const data = reactive({
  formData: {},
  tableDataLoading: false,
  tableData: [],
  total: 0,
  listQuery: {
    currPage: 1,
    pageSize: 10,
  },
  showDialog: false,
  form: {
    accountName: '',
  },
  formRules: {
    accountName: [{ required: true, message: '请输入', trigger: 'blur' }],
  },
})

const ruleFormRef = ref()

const { formData, tableDataLoading, tableData, total, listQuery, form, formRules, showDialog } =
  toRefs(data)

const submit = async () => {
  await ruleFormRef.value.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

function close() {
  showDialog.value = false
  ruleFormRef.value.resetFields()
}
function search() {
  listQuery.value.currPage = 0
  getList()
}

const getList = async () => {
  tableDataLoading.value = true
  try {
    const params = {
      ...formData.value,
      ...listQuery.value,
    }
    const { resultData, totalCount } = await list(params)
    tableData.value = resultData
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}
</script>

<style scoped lang="scss"></style>
