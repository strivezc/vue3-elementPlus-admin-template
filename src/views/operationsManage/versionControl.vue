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
          <el-form-item label="平台" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio label="">全部</el-radio>
              <el-radio :label="0">安卓</el-radio>
              <el-radio :label="1">ios</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio label="">全部</el-radio>
              <el-radio :label="0">正常</el-radio>
              <el-radio :label="1">下架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="版本号">
            <el-input v-model="formData.accountName" placeholder="版本号" class="input" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" native-type="submit" @click="getList">查询</el-button>
        <el-button type="success" @click="add">新增</el-button>
      </el-form-item>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="平台" prop="createTime"></el-table-column>
        <el-table-column align="center" label="版本号" prop="createTime"></el-table-column>
        <el-table-column align="center" label="强制更新" prop="createTime"></el-table-column>
        <el-table-column align="center" label="更新内容" prop="createTime"></el-table-column>
        <el-table-column align="center" label="创建人" prop="createTime"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime"></el-table-column>
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

    <el-dialog title="新增版本信息" draggable v-model="showDialog" :before-close="close" width="650px">
      <el-form :model="form" :rules="formRules" label-position="right" label-width="80px"  ref="ruleFormRef">
        <el-form-item label="平台:" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">安卓</el-radio>
            <el-radio :label="1">ios</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="版本号:">
          <el-input v-model="form.accountName" placeholder="版本号" class="form-input" />
        </el-form-item>
        <el-form-item label="更新内容:" prop="reply">
          <el-input
              class="form-textarea"
              v-model="form.reply"
              placeholder="更新内容"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6 }"
              show-word-limit
          />
        </el-form-item>
        <el-form-item label="下载地址:">
          <el-input v-model="form.accountName" placeholder="下载地址" class="form-input" />
        </el-form-item>
        <el-form-item label="更新版本范围:" label-width="105px">
        </el-form-item>
        <el-form-item label="强制升级:" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
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

<script setup name="VersionControl">
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

function add() {
  showDialog.value = true
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
