<template>
  <div class="app-container">
    <el-form
        :inline="true"
        class="form-border"
        autocomplete="on"
        :model="formData"
        onsubmit="return false"
    >
      <el-form-item label="问题分类">
        <el-select class="select" v-model="formData.type" placeholder="请选择">
          <el-option label="全部" value=""/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="所属分类" prop="createTime"></el-table-column>
        <el-table-column align="center" label="提交时间" prop="createTime"></el-table-column>
        <el-table-column align="center" label="提交人" prop="createTime"></el-table-column>
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
    <el-dialog title="回复" draggable v-model="showDialog" :before-close="close" width="500px">
      <el-form :model="form" :rules="formRules" ref="ruleFormRef">
        <el-form-item>
          <el-select class="form-select" v-model="form.topic" placeholder="请选择">
            <el-option label="全部" value=""/>
          </el-select>
        </el-form-item>
        <el-form-item prop="reply">
          <el-input
              class="form-textarea"
              v-model="form.reply"
              placeholder="最多输入200个字符"
              type="textarea"
              maxlength="200"
              :autosize="{ minRows: 4, maxRows: 6 }"
              show-word-limit
          />
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

<script setup name="Feedback">
import { list } from '@/api'

const { proxy } = getCurrentInstance()

const data = reactive({
  formData: {},
  tableDataLoading: false,
  tableData: [],
  total: 0,
  listQuery: {
    currPage: 1,
    pageSize: 10
  },
  showDialog: false,
  form: {
    accountName: ''
  },
  formRules: {
    accountName: [{ required: true, message: '请输入', trigger: 'blur' }]
  }
})
const ruleFormRef = ref()
const { formData, tableDataLoading, tableData, total, listQuery, form, formRules, showDialog } = toRefs(data)

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
      ...listQuery.value
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

<style scoped lang="scss">

</style>
