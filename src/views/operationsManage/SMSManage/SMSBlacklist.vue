<template>
  <div class="app-container">
    <el-form
      :inline="true"
      class="form-border"
      autocomplete="on"
      :model="formData"
      onsubmit="return false"
    >
      <el-form-item label="手机号码">
        <el-input v-model="formData.phone" placeholder="手机号码" class="input" />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="formData.status">
          <el-radio label="">全部</el-radio>
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" @click="search" v-permission="'3420'"
          >查询</el-button
        >
        <el-button @click="clear" v-permission="'3420'">清空选项</el-button>
        <el-button type="success" @click="add" v-permission="'3422'">新增</el-button>
      </el-form-item>
    </el-form>
    <div class="pt20">
      <total-count :total="total"></total-count>
      <el-table v-loading="tableDataLoading" :data="tableData" border>
        <el-table-column align="center" label="手机号码" prop="phone"></el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime"></el-table-column>
        <el-table-column align="center" label="创建人" prop="createUser"></el-table-column>
        <el-table-column align="center" label="状态">
          <template #default="{ row }">
            {{ row.status === 0 ? '正常' : '禁用' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template #default="{ row }">
            <div class="button-box-row">
              <el-button
                type="danger"
                v-permission="'3423'"
                plain
                size="small"
                v-if="row.status === 0"
                @click="updateStatus(row.id, 1)"
                >禁用
              </el-button>
              <el-button
                type="primary"
                v-permission="'3423'"
                plain
                size="small"
                v-else
                @click="updateStatus(row.id, 0)"
                >启用
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="listQuery.currPage"
        v-model:limit="listQuery.pageSize"
        @pagination="getList"
      />
    </div>

    <el-dialog
      title="新增黑名单"
      draggable
      v-model="showDialog"
      :before-close="close"
      width="400px"
    >
      <el-form :model="form" :rules="formRules" ref="ruleFormRef">
        <el-form-item label="手机号:" prop="phone">
          <el-input v-model="form.phone" placeholder="手机号" class="form-input" />
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

<script setup name="SMSBlacklist">
const { proxy } = getCurrentInstance()

const state = reactive({
  formData: {
    phone: '',
    status: ''
  },
  tableDataLoading: false,
  tableData: [],
  total: 0,
  listQuery: {
    currPage: 1,
    pageSize: 10
  },
  showDialog: false,
  form: {
    phone: ''
  },
  formRules: {
    phone: [{ required: true, message: '请输入手机号码！', trigger: 'blur' }]
  }
})
const ruleFormRef = ref()
const { formData, tableDataLoading, tableData, total, listQuery, form, formRules, showDialog } =
  toRefs(state)

const submit = async () => {
  await ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        await proxy.$http.operation.addSmsBlack(form.value.phone)
        proxy.$modal.msgSuccess('操作成功!')
        close()
        getList()
      } catch (e) {
        console.log(e, 'error')
      }
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

function clear() {
  formData.value = {
    phone: '',
    status: ''
  }
  listQuery.value.currPage = 1
  getList()
}

const getList = async () => {
  tableDataLoading.value = true
  try {
    const params = {
      ...formData.value,
      ...listQuery.value
    }
    const { data, totalCount } = await proxy.$http.operation.smsBlack(params)
    tableData.value = data
    total.value = totalCount
  } catch (e) {
    console.log(e, 'error')
  } finally {
    tableDataLoading.value = false
  }
}
const updateStatus = async (id, status) => {
  proxy.$modal.confirm(status === 0 ? '确定要启用吗？' : '确定要禁用吗？').then(async () => {
    await proxy.$http.operation.updateSmsBlack(id)
    proxy.$modal.msgSuccess('操作成功!')
    getList()
  })
}
search()
</script>

<style scoped lang="scss"></style>
